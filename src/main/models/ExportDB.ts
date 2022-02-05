import { getConnection } from 'typeorm';
import fs from 'fs';
import { dialog, BrowserWindow } from 'electron';
import RecordingsData from 'db/entity/RecordingsData';

class ExportDB {
  constructor() {}

  /**
   * Exports the given recording data to a text file
   * @param recordingId - The id of the recording to get the data from
   */
  public static async exportToFile(
    _recordingId: number = 20,
    type: string
  ): Promise<boolean | 'canceled'> {
    try {
      // Show save dialog to get the export file path.
      const savePath = dialog.showSaveDialogSync(
        BrowserWindow.getAllWindows()[0]
      );
      const recordingId = 20;
      console.log(recordingId, type);

      // If the path was undefined, the export was canceled.
      if (!savePath) return 'canceled';

      // Create a write stream to write to a text file
      let writeStream = fs.createWriteStream(savePath + '.' + type);

      // Settings for querying data from the database.
      let offset = 0;
      const LIMIT = 50000;

      const columns = [
        'timeStamp',
        'O2Hb',
        'HHb',
        'THb',
        'TOI',
        'PDRawData',
        'LEDIntensities',
        'gainValues',
        'events',
        'sensor2RawData',
        'sensor3RawData',
      ];

      const columnTitles = [
        'timeStamp',
        'O2Hb',
        'HHb',
        'THb',
        'TOI',
        'PDRawData1',
        'PDRawData2',
        'PDRawData3',
        'PDRawData4',
        'PDRawData5',
        'Ambient Light',
        'LED1 Intensity',
        'LED2 Intensity',
        'LED3 Intensity',
        'LED4 Intensity',
        'LED5 Intensity',
        'Pre Gain/Hardware Gain',
        'Software Gain',
        'events',
        'sensor2RawData',
        'sensor3RawData',
      ];

      // let timeStamp = 0;
      // let count = 0;
      // let oldO2Hb = 0;
      // let oldHHb = 0;
      // let oldTHb = 0;
      // let oldTOI = 0;
      // let oldPDValues = [0, 0, 0, 0, 0, 0];

      // Add column title
      writeStream.write(columnTitles.join(',') + '\n', 'utf-8');

      // Run the loop while there's still recording data available
      while (true) {
        const records = await getConnection()
          .createQueryBuilder()
          .select(columns)
          .from(RecordingsData, '')
          // .where('recordingId = :recordingId', { recordingId })
          .limit(LIMIT)
          .offset(offset)
          .getRawMany();

        console.log(records);

        const RAW_RECORDS_LENGTH = records.length;

        // If there's no recording data, break the loop
        if (RAW_RECORDS_LENGTH === 0) break;

        // let records: any[] = [];
        // let data: any;

        // // Down sample data to 10Hz
        // for (let i = 0; i < RAW_RECORDS_LENGTH / 10; i++) {
        //   if (count === 10) {
        //     const mainData = {
        //       timeStamp: timeStamp / 1000,
        //       O2Hb: oldO2Hb / 10,
        //       HHb: oldHHb / 10,
        //       THb: oldTHb / 10,
        //       TOI: oldTOI / 10,
        //     };
        //     records.push(mainData);
        //     count = 0;
        //     oldO2Hb = 0;
        //     oldHHb = 0;
        //     oldTHb = 0;
        //     oldTOI = 0;
        //     oldPDValues = [0, 0, 0, 0, 0, 0];

        //     timeStamp += 100;
        //   }

        //   data = {
        //     timeStamp: 0,
        //     O2Hb: oldO2Hb + rawRecords[i].O2Hb,
        //     HHb: oldHHb + rawRecords[i].HHb,
        //     THb: oldTHb + rawRecords[i].THb,
        //     TOI: oldTOI + rawRecords[i].TOI,
        //   };

        //   const pdValues = rawRecords[i].PDRawData.split(',').map(
        //     (pdValue: string) => ~~pdValue
        //   );

        //   for (let j = 0; j < 6; j++) {
        //     data[`PDRawData${j + 1}`] = oldPDValues[j] + pdValues[j];
        //     oldPDValues[j] = pdValues[j];
        //   }

        //   oldO2Hb = data.O2Hb;
        //   oldHHb = data.HHb;
        //   oldTHb = data.THb;
        //   oldTOI = data.TOI;
        //   count += 1;
        // }

        // // Calculate the length once so that the for loop doesn't need to calculate it on
        // // every iteration

        // const RECORDS_LENGTH = records.length;

        // for (let ii = 0; ii < RECORDS_LENGTH; ii++) {
        //   for (const key in records[ii]) {
        //     writeStream.write(records[ii][key] + ',', 'utf-8');
        //   }
        //   writeStream.write('\n', 'utf-8');
        // }

        for (let i = 0; i < RAW_RECORDS_LENGTH - 1; i++) {
          for (const key in records[i]) {
            if (key === 'gainValues123') {
              const gain = JSON.parse(records[i][key]);
              const hardwareGain = gain.hardware.join(' ');
              const softwareGain = gain.software;

              writeStream.write(hardwareGain + ',', 'utf-8');
              writeStream.write(softwareGain + ',', 'utf-8');
            } else if (key === 'events123') {
              const events = JSON.parse(records[i][key]);
              const allEvents = [];
              for (const key in events) {
                allEvents.push(`${key}: ${events[key]}`);
              }
              writeStream.write(allEvents.join(' ') + ',', 'utf-8');
              allEvents.length = 0;
            } else {
              writeStream.write(records[i][key] + ',', 'utf-8');
            }
          }
          writeStream.write('\n', 'utf-8');
        }

        offset += LIMIT;
      }

      // Close the write stream once done.
      writeStream.close();

      return true;
    } catch (error: any) {
      // Catch any error that might occur
      throw new Error(error.message);
    }
  }

  /**
   * Gets the range of the recording data. Start & End
   * @param recordingId - The id of the recording to get the data from
   * @returns the start and end of the recording data or undefined
   */
  public static findRangeOfExportData = async (recordingId: number) => {
    try {
      const start = await getConnection()
        .createQueryBuilder()
        .select(['timeStamp'])
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .orderBy({ timeStamp: 'ASC' })
        .getRawOne();

      const end = await getConnection()
        .createQueryBuilder()
        .select(['timeStamp'])
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .orderBy({ timeStamp: 'DESC' })
        .getRawOne();

      return { start: start?.timeStamp, end: end?.timeStamp };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default ExportDB;
