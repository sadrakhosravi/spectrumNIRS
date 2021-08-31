/**
 * Creates and manages threads of the application
 */
const { Worker, isMainThread } = require('worker_threads');

const workersPath = './src/electron/Workers/';

const createWorkers = () => {
  if (isMainThread) {
  }
};

module.exports = createWorkers;
