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
      throw new Error(error.message);
    }
  }

  public static checkForRecordingData = async (recordingId: number) => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .select()
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .orderBy({ id: 'DESC' })
        .limit(3000)
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public static getRecordingDataForInterval = async (
    recordingId: number,
    start: number,
    end: number
  ) => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .select()
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .andWhere('timeStamp >= :start', { start })
        .andWhere('timeStamp <= :end', { end })
        .orderBy({ id: 'DESC' })
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default RecordData;
