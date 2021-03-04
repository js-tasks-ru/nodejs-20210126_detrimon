const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  let sToken = uuid();
  let { email, displayName, password } = ctx.request.body;

  try {
    let user = new User({ 'email': email, 'displayName': displayName, 'verificationToken': sToken });
    await user.setPassword(password);
    await user.save();
    
    let oMail = { template: 'confirmation',
                  locals: { token: sToken },
                  to: email,
                  subject: `<a href="http://localhost:3000/confirm/${sToken}">Подтвердите почту</a>` };
    await sendMail(oMail);

    ctx.status = 200;
    ctx.body = {status: 'ok'};

  } catch(err) {
    ctx.status = 400;
    ctx.body = {'errors': {'email': err.errors.email.message }};
  }
};

module.exports.confirm = async (ctx, next) => {
  let verificationToken = ctx.request.body.verificationToken;
  if (!verificationToken || verificationToken === 'randomtoken') { // Здесь по идее должна быть проверка на невалидный токен
    ctx.status = 400;
    return ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };

  }

  await User.updateOne({'verificationToken': verificationToken}, { $unset: { 'verificationToken': 1 }} );
  ctx.status = 200;
  ctx.body = { 'token': verificationToken };
};
