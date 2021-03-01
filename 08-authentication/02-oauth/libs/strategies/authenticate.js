const User = require('../../models/User');
const passport = require('passport')

module.exports = function authenticate(strategy, email, displayName, done) {

  if (!email) return done(null, false, 'Не указан email');

  User.findOne({'email': email})
    .then(oAccount => {
      if (oAccount) return done(null, oAccount);

      let oDocument = {'email': email, 'displayName': displayName};

      User.create(oDocument).then(user => done(null, user))
    })
    .catch (err => {
      done(err);
    })

  // Если пользователя нет в базе, то создаем для пользователя новый документ в базе и аутентифицируем после создания.
  // done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
