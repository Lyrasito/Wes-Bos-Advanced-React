const Mutations = {
  async createItem(parent, args, ctx, info) {
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
};

module.exports = Mutations;
