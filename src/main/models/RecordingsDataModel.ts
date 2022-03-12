import { getConnection } from 'typeorm';
import RecordingsData from 'db/entity/RecordingsData';

// Errors
// import DataError from './Errors/DataError';

class RecordingsDataModel {
  recordingId: number;
  transaction: any;
  data: any[];
  constructor(recordingId: number) {
    this.recordingId = recordingId;
    this.data = new Array(200).fill({});
  }

  public addDataToTransaction = (dataPoint: unknown) => {
    this.data.push(dataPoint);
  };

  public async insertTransactionData(data: any[]) {
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

  public checkForRecordingData = async (recordingId: number) => {
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

  public getRecordingDataForInterval = async (
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
        .orderBy({ id: 'ASC' })
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public getAllEvents = async (recordingId: number) => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .select()
        .from(RecordingsData, '')
        .where('recordingId = :recordingId', { recordingId })
        .andWhere('event = 1')
        .orderBy({ id: 'ASC' })
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default RecordingsDataModel;
