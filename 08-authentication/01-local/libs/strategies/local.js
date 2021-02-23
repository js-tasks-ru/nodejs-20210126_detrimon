const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      console.log(email, password);
      await User.findOne({'email': email}, async function(err, account) {
        console.log('ACCOUNT??? ', account);
        if (err) return done(err);

        if (!account) {          
          return done(err, false, 'Нет такого пользователя');
        }

        let isPasswordValid = await account.checkPassword(password);
        if (!isPasswordValid) {
          return done(err, false, 'Неверный пароль');
        }
        
        done(null, account);

      })

    },
);
