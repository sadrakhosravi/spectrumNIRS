// 'use strict';

// const { parentPort, workerData, isMainThread } = require('worker_threads');
// const path = require('path');
// const v5Calc = require('../calculations/V5/index').default;

// // workerData: {
// //   deviceName: deviceName - string,
// //   supportedSamplingRates: number[],
// //   probeSamplingRate: number,
// //   dataBatchSize: number,
// //   numOfElementsPerDataPoint: number,
// //   dbFilePath: string,
// //   calcOnly: boolean,
// // }

// const calc = new v5Calc();

// const handleMessage = (data) => {
//   console.log('HANDLE MESSAGE');

//   let delta = 0;
//   const timeStamp = data.timeStamp;
//   const calcData = calc.processRawData(data.data, workerData.dataBatchSize);
//   calcData.forEach((dataPoint) => {
//     dataPoint.unshift(timeStamp + delta);
//     delta += data.timeDelta;
//   });

//   parentPort.postMessage(calcData);
// };

// const handleCalcOnly = (data) => {
//   console.log('CALC ONLY');
// };

// parentPort.on('message', workerData.calcOnly ? handleCalcOnly : handleMessage);
