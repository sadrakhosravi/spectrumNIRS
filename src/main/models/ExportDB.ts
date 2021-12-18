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
    recordingId: number,
    type: string
  ): Promise<boolean | 'canceled'> {
    try {
      // Show save dialog to get the export file path.
      const savePath = dialog.showSaveDialogSync(
        BrowserWindow.getAllWindows()[0]
      );

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

      // Add column title
      writeStream.write(columnTitles.join(',') + '\n', 'utf-8');

      // Run the loop while there's still recording data available
      while (true) {
        const records = await getConnection()
          .createQueryBuilder()
          .select(columns)
          .from(RecordingsData, '')
          .where('recordingId = :recordingId', { recordingId })
          .limit(LIMIT)
          .offset(offset)
          .getRawMany();

        // If there's no recording data, break the loop
        if (records.length === 0) break;
        offset += LIMIT;
        console.log(records[1]);
        // Calculate the length once so that the for loop doesn't need to calculate it on
        // every iteration
        const RECORDS_LENGTH = records.length;
        for (let i = 0; i < RECORDS_LENGTH - 1; i++) {
          for (const key in records[i]) {
            if (key === 'gainValues') {
              const gain = JSON.parse(records[i][key]);
              const hardwareGain = gain.hardware.join(' ');
              const softwareGain = gain.software;

              writeStream.write(hardwareGain + ',', 'utf-8');
              writeStream.write(softwareGain + ',', 'utf-8');
            } else if (key === 'events') {
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
