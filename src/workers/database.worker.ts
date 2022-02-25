import SQLite3 from 'better-sqlite3';

let db: SQLite3.Database;

type EventData = {
  dbFilePath: string;
  recordingId: number;
  limit: number; // 30seconds
};

self.onmessage = ({ data }: { data: EventData }) => {
  db = new SQLite3(data.dbFilePath, { fileMustExist: true, readonly: true });
  if (!db) self.close();

  let selectStmt;

  if (data.limit) {
    selectStmt = db.prepare(
      `SELECT * FROM recordings_data WHERE recordingId=? ORDER BY timeStamp DESC LIMIT ${data.limit}`
    );
  } else {
    selectStmt = db.prepare(
      `SELECT * FROM recordings_data WHERE recordingId=? ORDER BY timeStamp ASC`
    );
  }

  let dbData = selectStmt.all(data.recordingId);
  const dbDataLength = dbData.length;

  if (data.limit) dbData.reverse();

  // // Process db data
  for (let i = 0; i < dbDataLength; i += 1) {
    dbData[i] = {
      ...dbData[i],
      LEDIntensities: dbData[i].LEDIntensities.split(',').map(
        (intensities: any) => ~~intensities
      ),
      PDRawData: dbData[i].PDRawData.split(',').map(
        (rawPdVal: any) => ~~rawPdVal
      ),
    };
  }
  self.postMessage(dbData);
  db.close();
};
