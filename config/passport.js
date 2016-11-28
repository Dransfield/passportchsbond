var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
FacebookStrategy=require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: '204758053307163',
    clientSecret: 'efc1758be36f4bfc488ea18f5680cb60',
    callbackURL: "http://localhost:1337/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {

    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

     if(password==user.password) {
          
            
          var returnUser = {
            email: user.email,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        }
        else
        {
        return done(null, false, {
              message: 'Invalid Password'
            });
       } 
    });
  }
));