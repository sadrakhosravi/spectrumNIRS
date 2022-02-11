'use strict';

const { parentPort, workerData, isMainThread } = require('worker_threads');
const v5Calc = require('../calculations/V5/index').default;

console.log('CALC WORKER!!');
console.log(isMainThread);

const calc = new v5Calc();

console.log(workerData);

const path = require('path');

parentPort.on('message', (_data) => {
  const data = calc.processRawData(_data, 10);
  parentPort.postMessage(data);
});
