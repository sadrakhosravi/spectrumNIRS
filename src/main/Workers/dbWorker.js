'use strict';

// load modules
const {
  isMainThread,
  MessageChannel,
  receiveMessageOnPort,
} = require('worker_threads');
const path = require('path');

// load files
const init = require(path.join(__dirname, '../DB/init.ts'));

console.log(isMainThread);

// Initialize the database
init();
