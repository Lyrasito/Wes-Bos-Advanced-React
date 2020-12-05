const { forwardTo } = require("prisma-binding");

const Query = {
  //Use forwardTo to get the requests directly from the api, if you don't want to add any middleware (authentication, etc)
  items: forwardTo("db"),
  item: forwardTo("db"),
  /*
  async items(parent, args, ctx, info) {
    const items = await ctx.db.query.items();

    return items;
  },
  */
};

module.exports = Query;
