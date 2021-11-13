import db from 'db/models/index';

class RecordData {
  recordingId: number;
  transaction: any;

  constructor(recordingId: number) {
    this.recordingId = recordingId;

    this.createTransaction();
  }

  async createTransaction() {
    this.transaction = await db.sequelize.transaction();
  }

  async addDataToTransaction(data: any) {
    try {
      await db.Data.bulkCreate(data);
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async commitTransaction() {
    try {
      await this.transaction.commit();
      this.transaction = await db.sequelize.transaction();
    } catch (error) {
      this.transaction.rollback();
    }
  }
}

export default RecordData;
