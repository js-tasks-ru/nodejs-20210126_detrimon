const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  let aMessages = await Message.find({ user: ctx.user.displayName });
  let aRespMessages = [];
  for (let oMessage of aMessages) {
    let oRespMessage = {
      id: oMessage._id,
      user: oMessage.user,
      date: oMessage.date,
      text: oMessage.text
    }
    aRespMessages.push(oRespMessage);
  }
  ctx.body = {messages: aRespMessages};
};
