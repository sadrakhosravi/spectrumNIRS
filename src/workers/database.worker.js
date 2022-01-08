'use strict';
import Database from 'better-sqlite3';

self.onmessage = ({ data }) => {
  const db = new Database(data, {
    readonly: true,
    fileMustExist: true,
  });
  console.time('example1');

  const selectAll = db.prepare('SELECT PDRawData from recordings_data');
  const PDRawValues = selectAll.all();

  const DATA_LENGTH = PDRawValues.length;
  const O2Hb = new Uint8Array(DATA_LENGTH);
  const HHb = new Uint8Array(DATA_LENGTH);
  const THb = new Uint8Array(DATA_LENGTH);
  const TOI = new Uint8Array(DATA_LENGTH);

  for (let i = 0; i < DATA_LENGTH; i += 1) {
    const pdValues = PDRawValues[i].PDRawData.split(',').map((value) =>
      parseInt(value)
    );
    O2Hb[i] = pdValues[0];
    HHb[i] = pdValues[1];
    THb[i] = pdValues[2];
    TOI[i] = pdValues[3];
  }
  console.timeEnd('example1');

  console.log(O2Hb);

  self.postMessage([O2Hb, HHb, THb, TOI]);

  console.log(db);
};
