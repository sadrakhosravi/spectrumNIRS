import { getConnection } from 'typeorm';
import fs from 'fs';
import { dialog, BrowserWindow } from 'electron';
import RecordingsData from 'db/entity/RecordingsData';
import RecordingModel from './RecordingModel';
import { dbParser } from '@lib/Stream/DatabaseParser';
import DBDataParser from './DBDataParser';

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
      const recordingId = RecordingModel.getCurrentRecording()?.id;

      // If the path was undefined, the export was canceled.
      if (!savePath) return 'canceled';
      if (!recordingId) return 'canceled';

      console.time('exporttimer');

      // Create a write stream to write to a text file
      let writeStream = fs.createWriteStream(savePath + '.' + type);

      // Settings for querying data from the database.
      let offset = 0;
      const LIMIT = 30000;

      const columns = [
        'timeStamp',
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
        const RAW_RECORDS_LENGTH = records.length;
        if (RAW_RECORDS_LENGTH === 0) break;
        offset += LIMIT;

        console.log(records.length);
        console.log('start');

        // Send the data to the calc worker
        const data = dbParser(records);

        for (let i = 0; i < RAW_RECORDS_LENGTH; i++) {
          for (const key in records[i]) {
            if (key === 'timeStamp') {
              writeStream.write(records[i][key] / 1000 + ',', 'utf-8');
              writeStream.write(data[i] + ',', 'utf-8');
              writeStream.write(data[i] + ',', 'utf-8');
              writeStream.write(data[i] + ',', 'utf-8');
              writeStream.write(data[i] + ',', 'utf-8');
            } else if (key === 'gainValues123') {
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
      }

      // Close the write stream once done.
      writeStream.close();
      console.timeEnd('exporttimer');

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
  public static findRangeOfExportData = async () => {
    const recordingId = RecordingModel.getCurrentRecording()?.id;
    if (!recordingId) return;

    try {
      const start = await getConnection()
        .createQueryBuilder()
        .select(['timeSequence'])
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .orderBy({ timeSequence: 'ASC' })
        .getRawOne();

      const end = await getConnection()
        .createQueryBuilder()
        .select(['timeSequence, data'])
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .orderBy({ timeSequence: 'DESC' })
        .getRawOne();

      const parsedData = DBDataParser.parseBlobData(end.data);
      const numOfDataPoints = parsedData.length;
      const endTimeSequence = end.timeSequence + numOfDataPoints * 10;

      return { start: start?.timeSequence, end: endTimeSequence };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default ExportDB;
