import { getConnection } from 'typeorm';
import fs from 'fs';
import { dialog, BrowserWindow } from 'electron';
import RecordingsData from 'db/entity/RecordingsData';
import RecordingModel from './RecordingModel';

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

      // Create a write stream to write to a text file
      let writeStream = fs.createWriteStream(savePath + '.' + type);

      // Settings for querying data from the database.
      let offset = 0;
      const LIMIT = 50000;

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

        const RAW_RECORDS_LENGTH = records.length;

        // If there's no recording data, break the loop
        if (RAW_RECORDS_LENGTH === 0) break;

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
  public static findRangeOfExportData = async () => {
    const recordingId = RecordingModel.getCurrentRecording()?.id;
    if (!recordingId) return;

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
