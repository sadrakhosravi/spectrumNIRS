import RecordingsData from 'db/entity/RecordingsData';
import { createQueryBuilder } from 'typeorm';
import DatabaseError from './DatabaseError';

class DummyData {
  amount: '30min' | '1hr';

  constructor(amount: '30min' | '1hr') {
    this.amount = amount;
  }

  public getDummyDataFromDb = async () => {
    try {
      return await createQueryBuilder()
        .select()
        .from(RecordingsData, '')
        .where('recordingId = 3')
        .limit(this.amount === '30min' ? 180 * 1000 : 360 * 1000)
        .getRawMany();
    } catch (error: any) {
      new DatabaseError(error.message);
      return;
    }
  };
}

export default DummyData;
