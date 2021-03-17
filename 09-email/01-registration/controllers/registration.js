const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  let sToken = uuid();
  let { email, displayName, password } = ctx.request.body;

    let user = new User({ 'email': email, 'displayName': displayName, 'verificationToken': sToken });
    await user.setPassword(password);
    await user.save();
    console.log(`<a href="http://localhost:3000/confirm/${sToken}">Подтвердите почту</a>`);
    
    let oMail = { template: 'confirmation',
                  locals: { token: sToken },
                  to: email,
                  subject: "Подтверждение регистрации на сайте!" };
    await sendMail(oMail);

    ctx.status = 200;
    ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  let verificationToken = ctx.request.body.verificationToken;
  if (!verificationToken || verificationToken === 'randomtoken') { // Здесь по идее должна быть проверка на невалидный токен
    ctx.status = 400;
    return ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
  }

  let updateResult = await User.updateOne({'verificationToken': verificationToken}, { $unset: { 'verificationToken': 1 }} );
  if (updateResult.n !== 1 && updateResult.Modified !== 1) {
    ctx.status = 400;
    return ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
  }
  
  ctx.status = 200;
  ctx.body = { 'token': verificationToken };
};
