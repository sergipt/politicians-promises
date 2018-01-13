'use strict';
const nconf = require('../configuration.js');
const views = require('co-views');
const monk = require('monk');
const atob = require('atob');
const bcrypt = require('bcrypt');
const token = require('rand-token').suid;
const db = monk(nconf.get('MONGODB_URL') || 'localhost/movied');
const filterProps = require('../services/utils').filterProps;
const raccoon = require('../services/raccoon');
const axios = require('../services/axios');

const User = db.get('users');
const Review = db.get('reviews');

module.exports.signIn = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  let decodedAuth = atob(ctx.header.authorization.split(' ')[1]).split(':');
  let user = decodedAuth[0];
  let password = decodedAuth[1];

  let userDB = await User.findOne({username:user});

  if (!userDB) {
    ctx.status = 400;
    ctx.body = {
      error:[
        'Username do not exists.'
      ]
    };
  } else if (bcrypt.compareSync(password, userDB.password)) {
    ctx.status = 200;
    ctx.body = await User.findOne({username:user});
  } else {
    ctx.status = 401;
    ctx.body = {
      error:[
        'Unauthorized'
      ]
    };
  }
};

module.exports.create = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();

  const userData = ctx.request.body;

  let user = await User.findOne({username:userData.username});

  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Username already exists.'
      ]
    };
  } else {
    userData.password = bcrypt.hashSync(userData.password, 10);
    userData.token = token(16);
    user = filterProps(userData, ['username', 'password', 'token']);
    console.log(user);
    ctx.body = await User.insert(user);
    ctx.status = 201;
  }
};

module.exports.me = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // retrieve the current user data

  ctx.body = ctx.user;
};

module.exports.myReviews = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // list my reviews

  let reviews = await Review.find({user_id: ctx.user['_id']});
  reviews = reviews.map((el) => {
    return filterProps(el, ['stars', 'movie_id']);
  });

  ctx.body = reviews;
};

module.exports.recommendations = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // list recommendations given by raccoon

  const userId = ctx.user['_id'];

  ctx.status = 200;

  const recommendations = await new Promise((resolve, reject) => {
    raccoon.recommendFor(userId, 10, results => resolve(results));
  });

  if (!recommendations || !recommendations.length > 0) {
    ctx.status = 200;
    ctx.body = [];
    return;
  }

  const movie_id = recommendations[0];
  try {
    const response = axios.get(`/movie/${movie_id}`);
    ctx.status = response.status;
    ctx.body = response.data;
  } catch (error) {
    ctx.status = error.response.status;
    ctx.body = error.response.data;
  }

};
