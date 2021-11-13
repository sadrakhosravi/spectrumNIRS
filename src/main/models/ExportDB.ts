import db from 'db/models';
import fs from 'fs';
import { dialog, BrowserWindow } from 'electron';

class ExportDB {
  recordingId: number;
  constructor(recordingId: number) {
    this.recordingId = recordingId;
  }

  async exportToTextFile(_experimentData: any) {
    const savePath = dialog.showSaveDialogSync(
      BrowserWindow.getAllWindows()[0]
    );
    // const experimentName = experimentData?.currentExperiment?.name || 'Test123';
    // const BATCH_SIZE = 10000;
    let writeStream = fs.createWriteStream(savePath + '.txt');
    const result = await db.Data.findAll({
      where: {
        recordingId: 1,
      },
      raw: true,
    });

    result.forEach((result: any) => {
      writeStream.write(result.values.toString() + '\n', 'utf-8');
    });

    writeStream.close();
  }
}

export default ExportDB;
