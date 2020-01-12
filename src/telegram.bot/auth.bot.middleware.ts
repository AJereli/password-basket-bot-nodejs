//
// export async function authUser(ctx, next) {
//   const tgId = ctx.update.message.chat.id;
//   const user = await this.userService.findUser(tgId);
//   if (user) {
//     ctx.user = user;
//     return  next();
//   } else {
//     await ctx.reply('Send /start command before');
//   }
// }
