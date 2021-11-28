// import db from 'db/models/index';
import { RecordingsData } from 'db/entity/RecordingsData';
import { getConnection } from 'typeorm';
class RecordData {
  recordingId: number;
  transaction: any;

  constructor(recordingId: number) {
    this.recordingId = recordingId;
  }

  async addDataToTransaction(data: any[]) {
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(RecordingsData)
        .values([...data])
        .useTransaction(true)
        .execute();
    } catch (error: any) {
      throw Error(error.message);
    }
  }
}

export default RecordData;
