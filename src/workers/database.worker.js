'use strict';

const { parentPort, workerData, isMainThread } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const v8 = require('v8');

const SQLITE = require('better-sqlite3');
const dbPath = path.join(__dirname, 'mydb2.db');

const db = new SQLITE(dbPath, {
  timeout: 1000,
});

db.exec(
  'CREATE TABLE IF NOT EXISTS sensor_data (id INTEGER PRIMARY KEY AUTOINCREMENT, timeStamp INTEGER, PDRawData BLOB, LEDIntensities BLOB, gainValues BLOB, events BLOB, recordingId INTEGER);'
);

const insert = db.prepare(
  'INSERT INTO sensor_data (timeStamp, PDRawData, LEDIntensities, gainValues, events, recordingId ) VALUES (@timeStamp, @PDRawData, @LEDIntensities, @gainValues, @events, @recordingId)'
);

const insertMany = db.transaction((myData) => {
  for (const dataPoint of myData) {
    insert.run(dataPoint);
  }
});
const sampleData = {
  timeStamp: 0,
  PDRawData: '12313,123123,12313,1243535,3456464,213132,42342',
  LEDIntensities: '123,435,123,4345,123,3435,132,345',
  gainValues: null,
  events: null,
  recordingId: null,
};

const myData = Array(20).fill(sampleData);

parentPort.on('message', (data) => {
  const data1 = data;
  insertMany(myData);
});

setTimeout(() => {
  db.close();
}, 1000);
