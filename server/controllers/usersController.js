'use strict';
const nconf = require('../configuration.js');
const monk = require('monk');
const atob = require('atob');
const db = monk(nconf.get('MONGODB_URL') || 'localhost/polipro');
const filterProps = require('../services/utils').filterProps;
const raccoon = require('../services/raccoon');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = db.get('users');

app.use(passport.initialize());
passport.use(new FacebookStrategy({
    clientID: '166886444041133',
    clientSecret: '28c758a77d1b3d6cf88f9a53fe55d8f1',
    callbackURL: "http://localhost:3006/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {


    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });

    .then(user => done(null, user))
    .catch(done)
  }
));

passport.use(new GoogleStrategy({
  consumerKey: '1006414047628-c0nojgcen4mkc0s2onokisg4e5r4omv2.apps.googleusercontent.com',
  consumerSecret: 'wr70u2MU-OjO9PkgBPLpmZfa',
  callbackURL: "http://localhost:3006/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
  }
));

module.exports.facebookAuth = async (ctx, next) => {
  console.log('facebookAuth:', ctx);
  if ('GET' != ctx.method) return await next();
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' });
};

module.exports.facebookCallback = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' });
};

module.exports.googleAuth = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] });
};

module.exports.googleCallback = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) { res.redirect('/'); };
};

module.exports.login = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();

  // const user = ctx.request.body;
  // // user = filterProps(user, ['username', 'token']);

  // let userDB = await User.findOne({usernme: user.username});

  // if (!userDB) {
  //   console.log('new user:', user);
  //   await User.insert(user);
  // } else {
  //   console.log('user:', user);
  //   await User.update({username: user.username}, {'token': user.token});
  // }
  // ctx.body = user;
  ctx.status = 201;
};

module.exports.logout = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  ctx.status = 201;
};

module.exports.me = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // retrieve the current user data

  ctx.body = ctx.user;
};

module.exports.myVotes = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // list my votes

};
