const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

const config = require('./config');

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackUrl,
  profileFields: config.facebook.profileFields,
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(function() {
    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
      if (err)
        return done(err);
      if (user) {
        return done(null, user);
      } else {
        user.facebook.id    = profile.id; 
        user.facebook.token = token;
        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;

        User.insert(user, function(err) {
          if (err) throw err;
          return done(null, user);
        });
      }
    });
  });
}));

passport.use(new GoogleStrategy({
  consumerKey: config.google.consumerKey,
  consumerSecret: config.google.consumerSecret,
  callbackURL: config.google.callbackURL,
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

module.exports = passport;