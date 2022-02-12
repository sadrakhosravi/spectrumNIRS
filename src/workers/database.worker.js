const { isMainThread, workerData, parentPort } = require('worker_threads');
const db = require('better-sqlite3')(workerData);

const data = new Array(10).fill({
  timeStamp: 0.0,
  PDRawData:
    '123431,12313,4324543,765756,87897,23123,123123,42325345,365456,456456,45674',
  LEDIntensities:
    '1233,123143,324535,34535,34535,3453,2324,234,433345,35353,3523',
  gainValues: '100,HIGH',
  events: 'sadhasde,rwerwr.er,ewqequwe32424284274234',
});

// setInterval(() => {
//   db.pragma('wal_checkpoint(RESTART)');
// }, 5 * 1000);

// Insert statement
const insert = db.prepare(
  'INSERT INTO recordings_data (timeStamp, PDRawData, LEDIntensities, gainValues, events) VALUES (@timeStamp, @PDRawData, @LEDIntensities, @gainValues, @events)'
);

const insertMany = db.transaction((data) => {
  const DATA_LENGTH = data.length;
  for (let i = 0; i < DATA_LENGTH; i += 1) insert.run(data[i]);
});

parentPort.on('message', (d) => {
  //   console.log(d);
  insertMany(data);
});
