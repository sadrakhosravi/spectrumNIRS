const { isMainThread, workerData, parentPort } = require('worker_threads');
const SQLITE3 = require('better-sqlite3');
const path = require('path');
const db = SQLITE3(path.join(__dirname, 'mydb.db'));

// The data file
const dataArr = [];

const pragma1 = db.pragma('cache_size=1');

console.log(pragma1);
const stmt = db.prepare(
  'INSERT INTO recordings_data(timeStamp,PDRawData, LEDIntensities) VALUES (?, ?, ?)'
);

const insertMany = db.transaction((dbData) => {
  for (let i = 0; i < 100; i++) stmt.run(10, 'sample', '1234');
  return;
});

const dbTransaction = () => {
  console.log(db.inTransaction);
  const dataArrLength = dataArr.length;

  try {
    db.exec(`BEGIN TRANSACTION`);
    for (let i = 0; i < dataArrLength; i++) {
      db.exec(
        `INSERT INTO recordings_data(timeStamp,PDRawData, LEDIntensities) VALUES (${dataArr[i].timeStamp}, ${dataArr[i].PDRawData}, ${dataArr[i].LEDIntensities})`
      );
    }
    db.exec(`COMMIT`);
  } catch (err) {
    console.log('Error');
    console.log(err.message);
  }
};

parentPort.on('message', (dataBatch) => {
  console.time('dbLoop');
  dataArr.push(...dataBatch);

  if (dataArr.length === 200) {
    console.log(dataArr);

    dbTransaction();
    dataArr.length = 0;
  }
  console.timeEnd('dbLoop');
});
