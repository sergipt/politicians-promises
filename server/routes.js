'use strict';

const usersController = require('./controllers/usersController');
const promisesController = require('./controllers/promisesController');

const router = require('koa-router')();

const authorize = async (ctx, next) => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  await next();
};

const routes = function (app) {
  router.post('/lists', authorize, promisesController.createList);
  router.post('/list/:id/delete', authorize, promisesController.deleteList);
  router.post('/list/:id/promise', authorize, promisesController.createPromise);
  router.get('/list/:id/promises', authorize, promisesController.showPromises);
  router.post('/promise/:id/delete', authorize, promisesController.deletePromise);
  router.get('/lists', promisesController.showAllLists);
  router.get('/list/:id', promisesController.showList);
  router.post('/promise/:id/vote', authorize, promisesController.votePromise);
  router.post('/promise/:id', authorize, promisesController.showPromise);
  router.get('/search', promisesController.search);

  router.get('/auth/facebook', usersController.facebookAuth);
  router.get('/auth/facebook/callback', usersController.facebookCallback);
  router.get('/auth/google', usersController.googleAuth);
  router.get('/auth/google/callback', usersController.googleCallback);
  
  router.get('/login', usersController.login);
  app.get('/logout', usersController.logout);
  router.get('/me', authorize, usersController.me);
  router.get('/me/votes', authorize, usersController.myVotes);

  router.options('/', options);
  router.trace('/', trace);
  router.head('/', head);

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
};


const head = async () => {
  return;
};

const options = async () => {
  this.body = 'Allow: HEAD,GET,PUT,DELETE,OPTIONS';
};

const trace = async () => {
  this.body = 'Smart! But you can\'t trace.';
};

module.exports = routes;
