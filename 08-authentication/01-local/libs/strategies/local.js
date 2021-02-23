const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      console.log(email, password);
      User.findOne({'email': email}, function(err, account) {
        if (err) return done(err);

        if (!account) {          
          return done(err, false, 'Нет такого пользователя');
        }

        account.checkPassword(password).then(isPasswordValid => {
          if (!isPasswordValid) return done(err, false, 'Неверный пароль');
          done(null, account);
        });
      })

    },
);
