'use strict';
const nconf = require('../configuration.js');
const filterProps = require('../services/utils').filterProps;
const raccoon = require('../services/raccoon');
const monk = require('monk');
const db = monk(nconf.get('MONGODB_URL') || 'localhost/polipro');

const User = db.get('users');
const List = db.get('lists');
const Promise = db.get('pormises');
const Vote = db.get('votes');

module.exports.createList = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();

  let list = ctx.request.body;

  list = filterProps(list, ['politician', 'party', 'position']);
  console.log('createList: ', list);
  list = await List.insert(list);

  ctx.status = 201;
  ctx.body = list;
};

module.exports.deleteList = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();

  let listId = ctx.params.id;

  listId = { '_id': listId};
  console.log('deleteList: ', listId);

  ctx.status = 201;
  ctx.body = await List.remove(listId);
};

module.exports.createPromise = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();

  let promise = ctx.request.body;
  promise.list_id = ctx.params.id;

  promise = filterProps(promise, ['list_id', 'text', 'date', 'links']);
  console.log('createPromise: ', promise);
  promise = await Promise.insert(promise);

  ctx.status = 201;
  ctx.body = promise;
};

module.exports.deletePromise = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();

  let promiseId = ctx.params.id;

  promiseId = { '_id': promiseId};
  console.log('deletePromiose: ', promiseId);

  ctx.status = 201;
  ctx.body = await Promise.remove(promiseId);
};

module.exports.showAllLists = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();

  let lists = await List.find({});

  ctx.body = lists;
};

module.exports.showList = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();

  let list = await List.findOne({'_id': ctx.params.id});

  ctx.body = list;
};

module.exports.showPromises = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  console.log('showPromises: ', ctx.params.id);
  let promises = await Promise.find({'list_id': ctx.params.id});

  ctx.body = promises;
};

module.exports.showPromise = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();

  let promise = await Promise.findOne({'_id': ctx.params.id});

  ctx.body = promise;
};

module.exports.votePromise = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();

  let vote = ctx.request.body;
  vote.promise_id = ctx.params.id;
  vote.user_id = ctx.params.id;

  vote = filterProps(vote, ['promise_id', 'user_id', 'vote']);
  console.log('createVote: ', vote);
  vote = await Vote.insert(vote);

  ctx.status = 201;
  ctx.body = vote;
};

module.exports.search = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // search for lists

  const config = {
    params:{
      query : ctx.request.query.q
    }
  };
};