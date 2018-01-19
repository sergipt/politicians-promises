'use strict';

const usersController = require('./controllers/usersController');
const promisesController = require('./controllers/promisesController');

const router = require('koa-router')();


const passport = require('./passport');

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
  router.get('/list/:id/promises', promisesController.showListPromises);
  router.post('/promise/:id/delete', authorize, promisesController.deletePromise);
  router.get('/lists', promisesController.showAllLists);
  router.get('/list/:id', promisesController.showListDetils);
  router.get('/votes', authorize, promisesController.getMyVotes);
  router.post('/promise/:id/vote', authorize, promisesController.votePromise);
  router.post('/promise/:id/unvote', authorize, promisesController.unvotePromise);
  router.post('/promise/:id', authorize, promisesController.showPromise);
  router.get('/search', promisesController.search);

  router.get('/login', authorize, usersController.login);
  router.post('/auth/facebook', usersController.authFacebook);
  router.post('/auth/google', usersController.authGoogle);
  router.get('/logout', usersController.logout);
  router.get('/me', authorize, usersController.me);

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
