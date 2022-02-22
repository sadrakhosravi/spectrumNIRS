'use strict';

const { ipcRenderer } = require('electron');
import BetterSqlite3 from 'better-sqlite3';

let db: BetterSqlite3.Database;
let insert: BetterSqlite3.Statement<any[]>;
//@ts-ignore
let dbTransaction: BetterSqlite3.Transaction;

// Initialize the database file
ipcRenderer.on('db:init', (_event, configs) => {
  if (configs.dbFilePath)
    db = new BetterSqlite3(configs.dbFilePath, {
      fileMustExist: true,
    });

  if (db) {
    db.pragma('cache_size = 1');
    db.pragma('memory_shrink');

    insert = db.prepare(
      'INSERT INTO recordings_data (timeStamp, PDRawData, LEDIntensities, gainValues, event, events, sensor2RawData, sensor3RawData, recordingId ) VALUES (@timeStamp, @PDRawData, @LEDIntensities, @gainValues,@event, @events, @sensor2RawData, @sensor3RawData, @recordingId)'
    );

    // Create the db transaction function
    dbTransaction = db.transaction((dbData: any[]) => {
      const dbDataLength = dbData.length;
      for (let i = 0; i < dbDataLength; i += 1) {
        insert.run(dbData[i]);
      }
    });
  }
});

// Handle incoming data to be saved to the database
ipcRenderer.on('db:data', (_event, data) => {
  dbTransaction(data);
});

// Close database file
ipcRenderer.on('db:close', (_event, _data) => {
  //@ts-ignore
  insert = undefined;
  //@ts-ignore
  dbTransaction = undefined;
  db.close();
  //@ts-ignore
  db = undefined;
});
