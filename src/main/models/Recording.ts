import { getConnection } from 'typeorm';
import { Recordings } from 'db/entity/Recordings';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';

export class Recording {
  /**
   * Creates a new recording record in the database.
   */
  public static createNewRecording = async (
    data: INewRecordingData
  ): Promise<any> => {
    try {
      const _newRecording = new Recordings();
      Object.assign(_newRecording, data);
      const newRecording = await _newRecording.save();

      console.log(newRecording);
      return {
        ...newRecording,
        createdAt: newRecording.createdAt.toString(),
        updatedAt: newRecording.updatedAt.toString(),
      };
    } catch (error: any) {
      console.log('Error RECORDING:' + error.message);
    }
  };

  /**
   * Retrieves all recordings related to the same patient
   * @param patientId
   */
  public static getAllRecordings = async (patientId: number): Promise<any> => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .select()
        .from(Recordings, '')
        .where('patientId = :patientId', { patientId })
        .orderBy({
          updatedAt: 'DESC',
        })
        .getRawMany();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default Recording;
