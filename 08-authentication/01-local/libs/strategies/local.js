const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        let account = await User.findOne({'email': email});

        if (!account) {          
          return done(null, false, 'Нет такого пользователя');
        }

        let isPasswordValid = await account.checkPassword(password);

        if (!isPasswordValid) {
          return done(null, false, 'Неверный пароль');
        }

        done(null, account);
      } catch (err) {
        if (err) return done(err);
      }
    },
);
