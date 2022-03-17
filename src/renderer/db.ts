import SQLite3 from 'better-sqlite3';
const { ipcRenderer } = require('electron');
const BetterSqlite3 = require('better-sqlite3');
import Snappy from 'snappy-electron';

let db: SQLite3.Database;
let insert: SQLite3.Statement<any[]>;
let dbTransaction: SQLite3.Transaction;
let recordingId: null | number = null;

// Initialize the database file
ipcRenderer.on('db:init', (_event, configs) => {
  try {
    if (configs.dbFilePath)
      db = new BetterSqlite3(configs.dbFilePath, {
        fileMustExist: true,
      });

    if (db) {
      db.pragma('cache_size = 1');
      db.pragma('memory_shrink');

      insert = db.prepare(
        'INSERT INTO recordings_data (data, events, other, timeStamp, timeSequence, recordingId) VALUES (?, ?, ?, ?, ?, ?)'
      );

      // Set current recording's Id
      recordingId = configs.recordingId;

      // Create the db transaction function
      dbTransaction = db.transaction(function (
        dbData: Buffer,
        events: Buffer | null,
        other: Buffer | null,
        timeStamp: number,
        timeSequence: number
      ) {
        insert.run(dbData, events, other, timeStamp, timeSequence, recordingId);

        return;
      });
    }
  } catch (e) {
    console.log('RENDERER DB ERROR');
  }
});

/**
 * Handles the incoming data and calls the dbTransaction function
 */
function handleDbData(_event: Electron.IpcRendererEvent, data: any) {
  const compressedDbData = Snappy.compressSync(data.data);
  let eventsCompressed;

  if (data.events.length !== 0) {
    const events = JSON.stringify(data.events);
    eventsCompressed = Snappy.compressSync(events);
  }

  dbTransaction(
    compressedDbData,
    eventsCompressed || null,
    data.other,
    data.timeStamp,
    data.timeSequence
  );
}

// Handle incoming data to be saved to the database
ipcRenderer.on('db:data', handleDbData); // Using arrow functions with this listener seems to cause memory leaks (the garbage collector marks the object but acts lazy and does not empty the memory)

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

// Close the db after the app quits
process.on('beforeExit', () => db?.close());
