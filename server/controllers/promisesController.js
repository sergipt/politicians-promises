'use strict';
const nconf = require('../configuration.js');
const filterProps = require('../services/utils').filterProps;
const raccoon = require('../services/raccoon');
const monk = require('monk');
const db = monk(nconf.get('MONGODB_URL') || 'localhost/polipro');

const User = db.get('users');
const List = db.get('lists');
const Promise = db.get('promises');
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
  promise = filterProps(promise, ['list_id', 'text', 'date']);
  console.log('createPromise: ', promise);
  try {
    await Promise.insert(promise);
  } catch(e) { 
    console.error('showListDetils', e);
  }
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

module.exports.showListDetils = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  try {
    let list = await List.findOne({'_id': ctx.params.id})
    ctx.status = 200;
    ctx.body = list;
  } catch(e) { 
    console.error('showListDetils', e);
  }
};

module.exports.showListPromises = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  try {
    let promises = await Promise.find({'list_id': ctx.params.id});
    ctx.status = 200;
    ctx.body = promises;
  } catch(e) { 
    console.error('showListDetils', e);
  }
};

module.exports.showPromise = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  let promise = await Promise.findOne({'_id': ctx.params.id});
  ctx.body = promise;
};

module.exports.getMyVotes = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  try {
    let votes = await Vote.find({'user_id': ctx.user._id});
    console.log('votes', votes, ctx.user._id);
    ctx.status = 200;
    ctx.body = votes;
  } catch(e) { 
    console.error('getMyVotes', e);
    ctx.status = 404;
  }
};

module.exports.votePromise = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  let vote = {};
  vote.promise_id = ctx.params.id;
  vote.user_id = ctx.user._id;
  vote.value = ctx.request.body.value;
  console.log('createVote: ', vote);
  try {
    await Vote.insert(vote);
    if (vote.value = 'yes') {
      try {
        await Promise.update({_id: vote.promise_id}, {$inc: {'votes_yes': 1}});
      } catch(e) { console.error('Promise.update', e);}
    } else if (vote.value = 'no') {
      try {
        await Promise.update({_id: vote.promise_id}, {$inc: {'votes_no': 1}});
      } catch(e) { console.error('Promise.update', e);}
    }  else if (vote.value = 'idk') {
      try {
        await Promise.update({_id: vote.promise_id}, {$inc: {'votes_idk': 1}});
      } catch(e) { console.error('Promise.update', e);}
    }
    ctx.status = 200;
    ctx.body = vote;
  } catch(e) { 
    console.error('User.update', e); 
    ctx.status = 400;
  }
};

module.exports.unvotePromise = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  let vote = {};
  vote.promise_id = ctx.params.id;
  vote.user_id = ctx.user._id;
  vote.value = ctx.request.body.value;
  console.log('delete: ', vote);
  try {
    await Vote.remove({'user_id': vote.user_id, 'promise_id': vote.promise_id});
    if (vote.value = 'yes') {
      try {
        await Promise.update({_id: vote.promise_id}, {$inc: {'votes_yes': -1}});
      } catch(e) { console.error('Promise.update', e);}
    } else if (vote.value = 'no') {
      try {
        await Promise.update({_id: vote.promise_id}, {$inc: {'votes_no': -1}});
      } catch(e) { console.error('Promise.update', e);}
    }  else if (vote.value = 'idk') {
      try {
        await Promise.update({_id: vote.promise_id}, {$inc: {'votes_idk': -1}});
      } catch(e) { console.error('Promise.update', e);}
    }
    ctx.status = 200;
    ctx.body = vote;
  } catch(e) { 
    console.error('User.update', e); 
    ctx.status = 400;
  }
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