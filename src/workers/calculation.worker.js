'use strict';

const { parentPort, workerData, isMainThread } = require('worker_threads');
const path = require('path');
const v5Calc = require('../calculations/V5/index').default;

// workerData: {
//   deviceName: deviceName - string,
//   supportedSamplingRates: number[],
//   probeSamplingRate: number,
//   dataBatchSize: number,
//   numOfElementsPerDataPoint: number,
//   dbFilePath: string,
// }
const calc = new v5Calc();

parentPort.on('message', (_data) => {
  const data = calc.processRawData(_data, 10);
  parentPort.postMessage(data);
});
