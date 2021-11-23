import db from 'db/models/index';
class RecordData {
  recordingId: number;
  transaction: any;

  constructor(recordingId: number) {
    this.recordingId = recordingId;
  }

  async addDataToTransaction(data: any) {
    try {
      db.Data.bulkCreate(data);
    } catch (error: any) {
      throw Error(error.message);
    }
  }
}

export default RecordData;
