/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },
    
        logingoogle:function(req,res){
passport.authenticate('google',{ scope: ['profile','email','Picture'] })(req, res);
	},
	googlecallback:function(req,res)
	{
		
		 passport.authenticate('google',{
            successRedirect : '/profile',
            failureRedirect : '/'
        })(req, res);;
	},
    
    logintwitter:function(req,res){
passport.authenticate('twitter')(req, res);
	},
	twittercallback:function(req,res)
	{
		
		 passport.authenticate('twitter',{
            successRedirect : '/profile',
            failureRedirect : '/'
        })(req, res);;
	},
	loginfacebook:function(req,res){
passport.authenticate('facebook',{ scope : [ 'email'] })(req, res);
	},
	facebookcallback:function(req,res)
	{
		
		 passport.authenticate('facebook',{
            successRedirect : '/profile',
            failureRedirect : '/'
        })(req, res);;
	},
    login: function(req, res) {

        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) res.send(err);
                return res.send({
                    message: info.message,
                    user: user
                });
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }
};


