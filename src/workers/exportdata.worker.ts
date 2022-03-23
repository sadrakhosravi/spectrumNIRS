/*
 * Exports data from the database to a file
 */
import BetterSqlite3 from 'better-sqlite3';

import { IRecordingData } from '@electron/models/RecordingModel';

import Export, { IExportOptions } from '@electron/models/Export/Export';

// Characters

// Global Variables

type DataType = {
  dbFilePath: string;
  currentRecording: IRecordingData;
  savePath: string;
  type: 'txt' | 'csv';
  options: IExportOptions;
};

self.onmessage = async ({ data }: { data: DataType }) => {
  const db = new BetterSqlite3(data.dbFilePath, {
    fileMustExist: true,
    readonly: true,
  });

  const selectStmt = db.prepare(
    `SELECT data, timeStamp, events, other FROM recordings_data WHERE recordingId=?`
  ) as any;
  selectStmt.raw(true);

  const dbData = selectStmt.all(data.currentRecording.id);

  // Initialize the export class that handles data exports
  const exportClass = new Export(
    data.savePath,
    data.currentRecording,
    dbData,
    data.options
  );
  await exportClass.init(data.type);

  db.close();
  setTimeout(() => self.postMessage('end'), 100);
};
