import ServiceManager from '../../services/ServiceManager';

export class RecordingQueries {
  /**
   * @returns a promise of all the recordings record in the database.
   */
  public static async getAllRecordings() {
    console.log(ServiceManager);
    return await ServiceManager.dbConnection.all('SELECT * FROM recordings');
  }
}
