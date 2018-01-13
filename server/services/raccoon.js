'use strict';

const raccoon = require('raccoon');
const nconf = require('../configuration.js');

const REDIS_URL = nconf.get('REDIS_URL') || '//127.0.0.1:6379';

const client = require('redis').createClient(REDIS_URL);
raccoon.setClient(client);

module.exports = raccoon;
