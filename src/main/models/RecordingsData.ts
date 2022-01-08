// import db from 'db/models/index';
import { getConnection } from 'typeorm';
import RecordingsData from 'db/entity/RecordingsData';
import AccurateTimer from '@electron/helpers/accurateTimer';
import { ChartChannels } from '@utils/channels';

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
        .orderBy({ id: 'ASC' })
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public static streamRecordingData = async (
    recordingId: number,
    sender: any
  ) => {
    try {
      const LIMIT = 100000;
      let offset = 0;
      let isStopped = false;
      const streamTimer = new AccurateTimer(async () => {
        console.time('querydb');

        const data = await getConnection()
          .createQueryBuilder()
          .select(['timeStamp as x', 'O2Hb', 'HHb', 'THb', 'TOI'])
          .from(RecordingsData, '')
          .where('recordingId = :recordingId', { recordingId })
          .limit(LIMIT)
          .offset(offset)
          .orderBy({ id: 'ASC' })
          .getRawMany();

        offset += LIMIT;

        if (data.length < 1) {
          !isStopped && sender.send(ChartChannels.StreamData, []);
          isStopped = true;
          streamTimer.stop();
          console.log('Stream Stopped');
        }

        !isStopped && sender.send(ChartChannels.StreamData, data);
        !isStopped && console.timeEnd('querydb');
      }, 20);
      streamTimer.start();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  public static getAllEvents = async (recordingId: number) => {
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

export default RecordData;
