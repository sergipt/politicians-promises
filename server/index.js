'use strict';
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = module.exports = new koa();
const routes = require('./routes.js');
const config = require('./config.js');

const monk = require('monk');
const nconf = require('./configuration.js');
const db = monk(nconf.get('MONGODB_URL') || 'localhost/polipro');
const User = db.get('users');

// Logger
app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = undefined;
    switch (ctx.status) {
    case 401:
      ctx.app.emit('error', err, this);
      break;
    default:
      if (err.message) {
        ctx.body = {errors:[err.message]};
      }
      ctx.app.emit('error', err, this);
    }
  }
});

app.use(async (ctx, next) => {
  let authorization = ctx.headers.authorization;
  if (!authorization || authorization.split(' ')[0] != 'Bearer') return await next();
  ctx.token = authorization.split(' ')[1];
  // console.log('authorization accessToken', ctx.token);
  ctx.user = await User.findOne({accessToken: ctx.token});

  return await next();
});

routes(app);

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

if (!module.parent) {
  const port = process.env.PORT || 3006;
  app.listen(port);
  // eslint-disable-next-line
  console.log('Listening to %s', port);
}