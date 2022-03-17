/*
 * Exports data from the database to a file
 */
import BetterSqlite3 from 'better-sqlite3';
import fs from 'fs';

import V5Calculations from '../calculations/V5/V5Calculation';
import DatabaseOperations from '@electron/models/Database/DatabaseOperations';
import { IRecordingData } from '@electron/models/RecordingModel';
import columnify from 'columnify';

// Characters
const NEWLINE_CHAR = '\n';

// Global Variables
let writeStream: fs.WriteStream;

const calcColumns = ['', 'O2Hb', 'HHb', 'THb', 'TOI'];
const ADCColumns = [
  'ADC1_Ch1',
  'ADC1_Ch2',
  'ADC1_Ch3',
  'ADC1_Ch4',
  'ADC1_Ch5',
  'Ambient',
];

type DataType = {
  dbFilePath: string;
  currentRecording: IRecordingData;
  savePath: number;
  type: 'txt' | 'csv';
};

self.onmessage = ({ data }: { data: DataType }) => {
  const db = new BetterSqlite3(data.dbFilePath, {
    fileMustExist: true,
    readonly: true,
  });

  switch (data.type) {
    case 'csv':
      handleExcelExport(db, data);
      break;

    case 'txt':
      handleTextExport(db, data);
      break;

    default:
      handleTextExport(db, data);
      break;
  }

  writeStream.close();

  writeStream.on('close', () => {
    db.close();
    setTimeout(() => self.postMessage('end'), 100);
  });
};

const handleTextExport = (db: BetterSqlite3.Database, data: DataType) => {
  // Determine the time delta in ms
  const timeDelta = 1000 / data.currentRecording.probeSettings.samplingRate;
  let timeSequence = 0;
  const calc = new V5Calculations(
    data.currentRecording.probeSettings.intensities
  );

  // Edit default pragmas to get the fastest read from SQLite 3
  db.pragma('cache_size = 8192');
  db.pragma('page_size =8192');

  const selectStmt = db.prepare(
    `SELECT data, timeStamp, events, other FROM recordings_data WHERE recordingId=?`
  ) as any;

  selectStmt.raw(true);

  // Create a write stream to write to a text file
  writeStream = fs.createWriteStream(data.savePath + '.' + data.type);

  const dbData = selectStmt.all(data.currentRecording.id);
  const DbDataLength = dbData.length;

  // Add data headers
  const intervalFormat = `Interval = \t ${timeDelta / 1000} s`;
  const startTimeOfDay = `Start Time of Day = ${new Date(dbData[0][1])}`;
  const LEDInt = `LED Intensities = ${data.currentRecording.probeSettings.intensities.join(
    ','
  )}`;

  writeStream.write(intervalFormat + NEWLINE_CHAR, 'utf-8');
  writeStream.write(startTimeOfDay.toString() + NEWLINE_CHAR, 'utf-8');
  writeStream.write(LEDInt + NEWLINE_CHAR, 'utf-8');
  writeStream.write(NEWLINE_CHAR + NEWLINE_CHAR, 'utf-8');

  let firstOutput = true;

  // Loops through all the db data
  for (let i = 0; i < DbDataLength; i++) {
    const data = DatabaseOperations.parseData(dbData[i][0] as Buffer);
    const dataLength = data.length;
    const calcData = calc.processRawData(data, dataLength, 0, 0);

    if (calcData.length !== dataLength) return; // Something went wrong
    const dataPoints: any[] = [];

    // Loops through all data packet data point
    for (let j = 0; j < dataLength; j += 1) {
      const dataObj: any = {};

      // Add timeSequence
      dataObj.Time = timeSequence / 1000; // in seconds

      // Add calculated data
      calcData[j].forEach((value, ind) => {
        if (ind !== 0) dataObj[calcColumns[ind]] = value.toFixed(12);
      });

      // Add PD raw data
      data[j].ADC1.forEach((value, ind) => {
        dataObj[ADCColumns[ind]] = value;
      });

      // Add hardware gain
      dataObj.Gain = 0;

      dataPoints.push(dataObj);

      if (dataPoints.length === 50) {
        const columns = columnify(dataPoints, {
          showHeaders: firstOutput,
          preserveNewLines: true,
          minWidth: 15,
        });
        firstOutput = false;
        // Write to file
        writeStream.write(columns + NEWLINE_CHAR, 'utf-8');

        dataPoints.length = 0;
      }

      timeSequence += timeDelta;
    }

    const columns = columnify(dataPoints, {
      showHeaders: firstOutput,
      preserveNewLines: true,
      minWidth: 15,
    });

    dataPoints.length = 0;
    // Write to file
    writeStream.write(columns + NEWLINE_CHAR, 'utf-8');
  }
};

const handleExcelExport = (db: BetterSqlite3.Database, data: DataType) => {
  const timeDelta = 1000 / data.currentRecording.probeSettings.samplingRate;
  let timeSequence = 0;
  const calc = new V5Calculations(
    data.currentRecording.probeSettings.intensities
  );
  // Edit default pragmas to get the fastest read from SQLite 3
  db.pragma('cache_size = 8192');
  db.pragma('page_size =8192');

  const selectStmt = db.prepare(
    `SELECT data, timeStamp FROM recordings_data WHERE recordingId=?`
  );
  selectStmt.raw(true);

  // Create a write stream to write to a text file
  writeStream = fs.createWriteStream(data.savePath + '.' + data.type);

  // Settings for querying data from the database.
  //  let offset = 0;
  //  const LIMIT = 30000;

  const columnTitles = [
    'Time(s)',
    'O2Hb',
    'HHb',
    'THb',
    'TOI',
    'ADC1_CH1',
    'ADC1_CH2',
    'ADC1_CH3',
    'ADC1_CH4',
    'ADC1_CH5',
    'Ambient',
    'Gain',
    'Events',
  ];

  const dbData = selectStmt.all(data.currentRecording.id);
  const DbDataLength = dbData.length;

  // Add data headers
  const intervalFormat = `Interval, \t ${timeDelta / 1000} s`;
  const startTimeOfDay = `Start Time of Day, ${new Date(dbData[0][1])}`;
  const LEDInt = `LED Intensities, ${data.currentRecording.probeSettings.intensities.join(
    ','
  )}`;

  writeStream.write(intervalFormat + NEWLINE_CHAR, 'utf-8');
  writeStream.write(startTimeOfDay.toString() + NEWLINE_CHAR, 'utf-8');
  writeStream.write(LEDInt + NEWLINE_CHAR, 'utf-8');
  writeStream.write(NEWLINE_CHAR + NEWLINE_CHAR, 'utf-8');

  // FORMAT
  // 'Time(s)','O2Hb','HHb','THb','TOI','ADC1_CH1','ADC1_CH2','ADC1_CH3','ADC1_CH4','ADC1_CH5','Ambient','Gain','Events'

  // Add column title
  writeStream.write(columnTitles.join(',') + NEWLINE_CHAR, 'utf-8');

  // Loops through all the db data
  for (let i = 0; i < DbDataLength; i++) {
    const data = DatabaseOperations.parseData(dbData[i][0] as Buffer);
    const dataLength = data.length;
    const calcData = calc.processRawData(data, dataLength, 0, 0);

    if (calcData.length !== dataLength) return; // Something went wrong

    // Loops through all data packet data point
    for (let j = 0; j < dataLength; j += 1) {
      const dataPoint: any[] = [];

      // Add timeSequence
      dataPoint.push(timeSequence / 1000);

      // Add calculated data
      calcData[j].forEach((value, ind) => ind !== 0 && dataPoint.push(value));

      // Add PD raw data
      data[j].ADC1.forEach((pdValue: number) => dataPoint.push(pdValue));

      // Add hardware gain
      dataPoint.push(0);

      // Add events
      dataPoint.push('');

      // Write to file
      writeStream.write(dataPoint.join(',') + NEWLINE_CHAR, 'utf-8');

      timeSequence += timeDelta;
    }
  }
};
