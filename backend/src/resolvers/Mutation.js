const bcrypt = require("bcryptjs");
const {
  singleFieldOnlyMessage,
} = require("graphql/validation/rules/SingleFieldSubscriptions");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    console.log("Item being created");
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that");
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          //This is how to connect the Item to a User
          user: { connect: { id: ctx.request.userId } },
        },
      },
      info
    );
    return item;
  },

  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    const item = await ctx.db.mutation.updateItem({
      data: updates,
      where: { id: args.id },
    });
    return item;
  },
  async deleteItem(parent, args, ctx, info) {
    if (!ctx.request.user) {
      throw new Error("You must be logged in");
    }
    //const where = { id: args.id };
    //1.find item
    const item = await ctx.db.query.item(
      { where: { id: args.id } },
      `{id title user{ id }}`
    );
    //2. check if user owns item, or has permissions

    if (item.user.id !== ctx.request.userId) {
      hasPermission(ctx.request.user, ["ITEMDELETE", "ADMIN"]);
    }

    //3. delete item
    return ctx.db.mutation.deleteItem({ where: { id: args.id } }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] },
        },
      },
      info
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    console.log(token);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Email and password do not match");
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return user;
  },

  async logout(parent, args, ctx, info) {
    const cookie = ctx.response.clearCookie("token");
    return { message: "Goodbye" };
  },

  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }

    const promisifiedResetToken = promisify(randomBytes);
    const resetToken = (await promisifiedResetToken(20)).toString("hex");

    const resetTokenExpiry = Date.now() + 3600000; //1 hour

    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    const mailRes = await transport.sendMail({
      from: "mariegoudy@gmail.com",
      to: user.email,
      subject: "Your Password Reset Link",
      html: makeANiceEmail(
        `Your password reset link is here! \n\n <a href='${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}'>Click to reset password.</a>`
      ),
    });

    return { message: "Booyah" };
  },

  async resetPassword(
    parent,
    { resetToken, password, confirmPassword },
    ctx,
    info
  ) {
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }
    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gte: Date.now() - 3600000 },
    });
    if (!user) {
      throw new Error("This token is either invalid or expired");
    }

    const newPassword = await bcrypt.hash(password, 10);

    const savedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    const token = jwt.sign({ userId: savedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return savedUser;
  },

  async updatePermissions(parent, { userId, permissions }, ctx, info) {
    if (!ctx.request.user) {
      throw new Error("You must be logged in!");
    }
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    //const user = await ctx.db.query.user({ where: { id: userId } });
    const updatedUser = await ctx.db.mutation.updateUser(
      {
        where: { id: userId },
        data: { permissions: { set: permissions } },
      },
      info
    );

    return updatedUser;
  },
  async addToCart(parent, { id }, ctx, info) {
    const userId = ctx.request.userId;
    if (!userId) {
      throw new Error("You must be signed in");
    }

    const [existingCartItem] = await ctx.db.query.cartItems({
      where: { user: { id: userId }, item: { id } },
    });
    if (existingCartItem) {
      console.log("item is already in cart");
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      });
    }
    const newItem = await ctx.db.mutation.createCartItem({
      data: {
        user: { connect: { id: userId } },
        item: { connect: { id } },
      },
    });
    return newItem;
  },
  async removeFromCart(parent, { id }, ctx, info) {
    const userId = ctx.request.userId;
    if (!userId) {
      throw new Error("You must be logged in");
    }
    console.log(id);
    const cartItem = await ctx.db.query.cartItem(
      { where: { id } },
      `{id, quantity, user{id}}`
    );
    if (!cartItem) {
      throw new Error("Item not found");
    }
    if (cartItem.user.id !== userId) {
      throw new Error("That item doesn't belong to you.");
    }
    if (cartItem.quantity > 1) {
      const newCartItem = await ctx.db.mutation.updateCartItem({
        where: { id },
        data: { quantity: cartItem.quantity - 1 },
      });
      return newCartItem;
    }
    return ctx.db.mutation.deleteCartItem({ where: { id } }, info);
  },
};

module.exports = Mutations;
