const {
  unusedFragMessage,
} = require("graphql/validation/rules/NoUnusedFragments");
const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  //Use forwardTo to get the requests directly from the api, if you don't want to add any middleware (authentication, etc)
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  user: forwardTo("db"),
  me(parent, args, ctx, info) {
    const id = ctx.request.userId;
    if (!id) {
      return null;
    }
    return ctx.db.query.user({ where: { id } }, info);
  },
  async users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("No user logged in");
    }

    console.log("request", ctx.request.user);

    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    return ctx.db.query.users({}, info);
  },
  cartItem: forwardTo("db"),
  async order(parent, { id }, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) throw new Error("You must be logged in");
    const order = await ctx.db.query.order({ where: { id } }, info);
    const ownsOrder = order.user.id === userId;
    if (!ownsOrder) {
      hasPermission(ctx.request.user, ["ADMIN"]);
    }
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    const orders = await ctx.db.query.orders(
      {
        where: { user: { id: userId } },
      },
      info
    );
    return orders;
  },
  /*
  async items(parent, args, ctx, info) {
    const items = await ctx.db.query.items();

    return items;
  },
  */
};

module.exports = Query;
