/*
 * Exports data from the database to a file
 */
import BetterSqlite3 from 'better-sqlite3';
import fs from 'fs';

import { DBDataModel } from '@lib/dataTypes/BinaryData';
import Snappy from 'snappy-electron';

import V5Calculations from '../calculations/V5/V5Calculation';

type DataType = {
  dbFilePath: string;
  recordingId: number;
  savePath: number;
  type: string;
  samplingRate: number;
};

self.onmessage = ({ data }: { data: DataType }) => {
  const db = new BetterSqlite3(data.dbFilePath, {
    fileMustExist: true,
    readonly: true,
  });

  // Determine the time delta in ms

  //@ts-ignore
  const timeDelta = 1000 / data.samplingRate;
  //@ts-ignore
  let timeSequence = 0;
  const calc = new V5Calculations([140, 150, 150, 125, 160]);

  // Edit default pragmas to get the fastest read from SQLite 3
  db.pragma('cache_size = 8192');
  db.pragma('page_size =8192');

  const selectStmt = db.prepare(
    `SELECT data, timeStamp FROM recordings_data WHERE recordingId=?`
  );
  selectStmt.raw(true);

  // Create a write stream to write to a text file
  let writeStream = fs.createWriteStream(data.savePath + '.' + data.type);

  // Settings for querying data from the database.
  //  let offset = 0;
  //  const LIMIT = 30000;

  const columnTitles = [
    'Time Sequence',
    'O2Hb',
    'HHb',
    'THb',
    'TOI',
    'PD1RawData',
    'PD2RawData',
    'PD3RawData',
    'PD4RawData',
    'PD5RawData',
    'Ambient',
    'LED1 Intensity',
    'LED2 Intensity',
    'LED3 Intensity',
    'LED4 Intensity',
    'LED5 Intensity',
    'Hardware Gain',
    'Events',
    'Other Data1',
    'Other Data 2',
  ];

  // Add column title
  writeStream.write(columnTitles.join(',') + '\n', 'utf-8');

  const dbData = selectStmt.all(data.recordingId);
  const DbDataLength = dbData.length;

  const deviceInfo = {
    LEDIntensities: [120, 140, 150, 160, 120],
  };

  // FORMAT
  //'timeStamp','timeSequence','O2Hb','HHb','THb','TOI','PDRawData1','PDRawData2','PDRawData3','PDRawData4','PDRawData5','Ambient','LED1 Intensity','LED2 Intensity','LED3 Intensity','LED4 Intensity','LED5 Intensity','Hardware Gain','events','sensor2RawData','sensor3RawData',

  // Loops through all the db data
  for (let i = 0; i < DbDataLength; i++) {
    const uncompressedData = Snappy.uncompressSync(dbData[i][0]) as Buffer;
    const data = DBDataModel.fromBuffer(uncompressedData) as any[]; // Data packets
    const dataLength = data.length;
    const calcData = calc.processRawData(data, dataLength, 0, 0);

    console.log(calcData);

    if (calcData.length !== dataLength) return; // Something went wrong

    // Loops through all data packet data point
    for (let j = 0; j < dataLength; j += 1) {
      const dataPoint: any[] = [];

      // Add timeSequence
      dataPoint.push(timeSequence);

      // Add calculated data
      calcData[j].forEach((value, ind) => ind !== 0 && dataPoint.push(value));

      // Add PD raw data
      data[j].ADC1.forEach((pdValue: number) => dataPoint.push(pdValue));

      // Add Intensities
      deviceInfo.LEDIntensities.forEach((intValue: number) =>
        dataPoint.push(intValue)
      );

      // Add hardware gain
      dataPoint.push(data[j].Gain);

      // Add events
      dataPoint.push('');

      // Add other hardware data
      dataPoint.push('');
      dataPoint.push('');

      // Write to file
      writeStream.write(dataPoint.join(',') + '\n', 'utf-8');

      timeSequence += timeDelta;
    }
  }

  writeStream.close();
  db.close();

  writeStream.on('close', () => {
    setTimeout(() => self.postMessage('end'), 100);
  });
};
