const bcrypt = require("bcryptjs");
const {
  singleFieldOnlyMessage,
} = require("graphql/validation/rules/SingleFieldSubscriptions");
const jwt = require("jsonwebtoken");
const db = require("../db");

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
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    console.log(user.permissions);
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } }, info);
    console.log(user);
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
    console.log(user);
    return user;
  },
};

module.exports = Mutations;
