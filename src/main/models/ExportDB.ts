import { getConnection } from 'typeorm';
import { RecordingsData } from 'db/entity/RecordingsData';
import fs from 'fs';
import { dialog, BrowserWindow } from 'electron';

class ExportDB {
  recordingId: number;
  constructor(recordingId: number) {
    this.recordingId = recordingId;
  }

  /**
   * Exports the given recording data to a text file
   * @param recordingId - Recording of the the data to be exported
   */
  async exportToTextFile(recordingId: number): Promise<boolean | 'canceled'> {
    try {
      // Show save dialog to get the export file path.
      const savePath = dialog.showSaveDialogSync(
        BrowserWindow.getAllWindows()[0]
      );

      console.log(recordingId);

      // If the path was undefined, the export was canceled.
      if (!savePath) return 'canceled';

      // Create a write stream to write to a text file
      let writeStream = fs.createWriteStream(savePath + '.txt');

      // Settings for querying data from the database.
      let offset = 0;
      const LIMIT = 50000;

      // Run the loop while there's still recording data available
      while (true) {
        const records = await getConnection()
          .createQueryBuilder()
          .select()
          .from(RecordingsData, '')
          .where('recordingId = :recordingId', { recordingId })
          .limit(LIMIT)
          .offset(offset)
          .getRawMany();

        // If there's no recording data, break the loop
        if (records.length === 0) break;
        offset += LIMIT;

        // Calculate the length once so that the for loop doesn't need to calculate it on
        // every iteration
        const RECORDS_LENGTH = records.length;
        for (let i = 0; i < RECORDS_LENGTH - 1; i++) {
          for (const property in records[i]) {
            writeStream.write(records[i][property].toString() + ',', 'utf-8');
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
}

export default ExportDB;
