module.exports.routes = {
  '/': {
    view: 'homepage'
  },

  'get /login': {
       view: 'login'
  },
	'/logintwitter': 'AuthController.logintwitter',
 '/auth/google_oauth':'AuthController.googlecallback',
	'/logingoogle': 'AuthController.logingoogle',

'/auth/twitter_oauth':'AuthController.twittercallback',
  'post /login': 'AuthController.login',
	'/loginfacebook': 'AuthController.loginfacebook',
  '/logout': 'AuthController.logout',
'/auth/facebook_oauth2':'AuthController.facebookcallback',
  'get /signup': {
    view: 'signup'
  }
};