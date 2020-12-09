const bcrypt = require("bcryptjs");
const {
  singleFieldOnlyMessage,
} = require("graphql/validation/rules/SingleFieldSubscriptions");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    console.log("Item being created");
    const item = await ctx.db.mutation.createItem({ data: { ...args } }, info);
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
    //const where = { id: args.id };
    //1.find item
    const item = await ctx.db.query.item(
      { where: { id: args.id } },
      `{id title}`
    );
    //2. check if user owns item, or has permissions
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
    console.log(res);
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
};

module.exports = Mutations;
