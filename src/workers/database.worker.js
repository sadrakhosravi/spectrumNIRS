'use strict';
import Database from 'better-sqlite3';

self.onmessage = ({ data }) => {
  const db = new Database(data.dbPath, {
    readonly: true,
    fileMustExist: true,
  });

  const selectAll = db.prepare('SELECT PDRawData from recordings_data');
  const PDRawValues = selectAll.all();

  const DATA_LENGTH = PDRawValues.length;
  const O2Hb = new Uint8Array(data.arr);
  const HHb = new Uint8Array(DATA_LENGTH);
  const THb = new Uint8Array(DATA_LENGTH);
  const TOI = new Uint8Array(DATA_LENGTH);

  for (let i = 0; i < DATA_LENGTH; i += 1) {
    const pdValues = PDRawValues[i].PDRawData.split(',');
    O2Hb[i] = parseInt(pdValues[0]);
  }
  self.postMessage(O2Hb);
};
