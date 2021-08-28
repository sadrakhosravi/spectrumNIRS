'use-strict';
/**
 * Creates and manages threads of the application
 */
const { Worker, isMainThread } = require('worker_threads');

const workersPath = './src/electron/Workers/';

const createWorkers = () => {
  if (isMainThread) {
  }
};

//Creats threads for reading the data from NIRS Sensor, doing calculation, and saving to DB.
exports.readUSBDataThreads = () => {};

module.exports = createWorkers;
