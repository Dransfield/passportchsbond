var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
FacebookStrategy=require('passport-facebook').Strategy;
TwitterStrategy=require('passport-twitter').Strategy;
GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log("deserialize user "+id);
	
    User.findOne({ id: id } , function (err, user) {
		console.log("user"+JSON.stringify(user));
		if (!user)
		{done(null, false);}
		else{
        done(err, user);}
    });
});
passport.use(new GoogleStrategy({
    clientID: '79902088919-rlb7uk2od7s3337tchn9h32jmo0elo7v.apps.googleusercontent.com',
    clientSecret: 'AChKZobq7KFTCf_jbs7hsxYn',
    callbackURL: "http://www.chessbond.com/auth/google_oauth2/"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }, function (err, user) {
       // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    //var newUser            = new User();
                    console.log(profile);
                    
					User.create({
                    // set all of the facebook information in our user model
                    googleId: profile.id, // set the users facebook id                   
                    googletoken : refreshToken, // we will save the token that facebook provides to the user                    
                    name:profile.displayName,
                    picture:profile.photos[0]
                                        }).exec( // look at the passport user profile to see how names are returned
                    
                    //facebookemail:  profile.emails[0].value}).exec( // facebook can return multiple emails so we'll take the first
					function (err, records) {
						console.log(err);
					return done(null, records);
					});

                        // if successful, return the new user
                        
                    }
    });
  }
));
   passport.use(new TwitterStrategy({
        consumerKey: 'ovZrQ8rjklukSpUdgyaxIFbM5',
        consumerSecret: "Ldrie1diKTTgQMWEV0AvL8WTa7jEYkaxPECoWbWDowig929PWd",
        callbackURL: 'http://www.chessbond.com/auth/twitter_oauth/'
      },
      function(token, tokenSecret, profile, done) {
        User.findOne({ twitterId: profile.id }, function (err, user) {
            // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    //var newUser            = new User();
                    console.log(profile);
                    
					User.create({
                    // set all of the facebook information in our user model
                    twitterId: profile.id, // set the users facebook id                   
                    twittertoken : token, // we will save the token that facebook provides to the user                    
                    name:profile._json.screen_name,
                    picture:profile._json.profile_image_url
                    }).exec( // look at the passport user profile to see how names are returned
                    
                    //facebookemail:  profile.emails[0].value}).exec( // facebook can return multiple emails so we'll take the first
					function (err, records) {
						console.log(err);
					return done(null, records);
					});

                        // if successful, return the new user
                        
                    }
                 }
     
    )}));

passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        //clientID        : configAuth.facebookAuth.clientID,
        //clientSecret    : configAuth.facebookAuth.clientSecret,
       // callbackURL     : configAuth.facebookAuth.callbackURL
        /*    clientID: '204930219956613',
    clientSecret: '6246902d2ef94f1dbd083fb4946c694b',
    callbackURL: "http://localhost:1337/auth/facebook_oauth2/"
*/
		clientID: '204758053307163',
		clientSecret:'efc1758be36f4bfc488ea18f5680cb60',
		 callbackURL: 'http://www.chessbond.com/auth/facebook_oauth2/',
		 profileFields: ['id', 'displayName', 'photos', 'email']
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebookid' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    //var newUser            = new User();
                    console.log(profile);
                    
					User.create({
                    // set all of the facebook information in our user model
                    facebookid: profile.id, // set the users facebook id                   
                    facebooktoken : token, // we will save the token that facebook provides to the user                    
                    facebookname  : profile.name.givenName + ' ' + profile.name.familyName,
                    email:profile._json.email,
                    name:profile.displayName,
                    picture:profile._json.picture.data.url
                    }).exec( // look at the passport user profile to see how names are returned
                    
                    //facebookemail:  profile.emails[0].value}).exec( // facebook can return multiple emails so we'll take the first
					function (err, records) {
						console.log(err);
					return done(null, records);
					});

                        // if successful, return the new user
                        
                    }
                }

            );
        });
	}));
        /*
passport.use(new FacebookStrategy({
    clientID: '204930219956613',
    clientSecret: '6246902d2ef94f1dbd083fb4946c694b',
    callbackURL: "http://localhost:1337/auth/facebook_oauth2/"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
*/
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