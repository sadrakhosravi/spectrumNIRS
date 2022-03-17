import { IRecordingData } from '@electron/models/RecordingModel';
import SQLite3 from 'better-sqlite3';
const BetterSqlite3 = require('better-sqlite3');

let db: SQLite3.Database;

type DBDataType = {
  dbFilePath: string;
  currentRecording: IRecordingData;
  limit: number; // 30seconds
  port: MessagePort;
  eventPort: MessagePort;
};

// const ONE_MINUTE = 60; // Seconds

self.onmessage = ({ data }: { data: DBDataType }) => {
  db = new BetterSqlite3(data.dbFilePath, {
    fileMustExist: true,
    readonly: true,
  });
  if (!db) self.close();

  const port = data.port;
  const eventPort = data.eventPort;

  // Edit default pragmas to get the fastest read from SQLite 3
  db.pragma('cache_size = 8192');
  db.pragma('page_size =8192');

  // Select statements
  let selectStmt;
  let timeSelectStmt;
  let eventSelectStmt;

  // Define prepared statements based on if there's a data limit
  if (data.limit) {
    selectStmt = db.prepare(
      `SELECT data FROM recordings_data WHERE recordingId=? ORDER BY timeStamp DESC LIMIT 12`
    );
    timeSelectStmt = db.prepare(
      `SELECT timeStamp, timeSequence, events, other FROM recordings_data WHERE recordingId=? ORDER BY timeStamp DESC LIMIT 12`
    );
  } else {
    selectStmt = db.prepare(
      `SELECT data FROM recordings_data WHERE recordingId=?`
    );
    timeSelectStmt = db.prepare(
      `SELECT timeStamp, timeSequence, events, other FROM recordings_data WHERE recordingId=?`
    );
  }

  eventSelectStmt = db.prepare(
    `SELECT events, other FROM recordings_data WHERE recordingId=?`
  );

  // For the fastest performance and easier iterations
  selectStmt.raw(true); // Array result instead of obj
  selectStmt.pluck(true); // Flattens the array

  const dbData = selectStmt.all(data.currentRecording.id);
  const dbTimeData = timeSelectStmt.all(data.currentRecording.id);
  const eventData = eventSelectStmt.all(data.currentRecording.id);

  // The array should be reversed for it to be properly graphed
  if (data.limit) {
    dbData.reverse();
    dbTimeData.reverse();
  }

  if (eventPort) {
    eventPort.postMessage(eventData);
  }

  port.postMessage({
    data: dbData,
    timeData: dbTimeData,
    byteLength: dbData[0]?.byteLength,
    batchSize: dbData.length,
  });

  port.onmessage = ({ data }) => {
    if (data === 'done') {
      port.close();
      self.postMessage('end');
    }
  };

  db.close();
};
