import { getConnection } from 'typeorm';
import { Recordings } from 'db/entity/Recordings';
import RecordingsDataModel from './RecordingsDataModel';
import GlobalStore from '@lib/globalStore/GlobalStore';
import ProbesManager from './ProbesManager';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';

export interface IRecordingData {
  createdAt: string;
  date: string;
  description: string;
  id: number;
  name: string;
  patient: number;
  settings: string;
  updatedAt: string;
}

class RecordingModel {
  currentRecording: Recordings | undefined;
  recordingsDataModel: RecordingsDataModel | undefined;

  constructor() {
    this.currentRecording = undefined;
    this.recordingsDataModel = undefined;
  }

  /**
   * @returns the current recording
   */
  public getCurrentRecording = () => this.currentRecording;

  /**
   * Sets the current recording data
   * @param recording - the recording to be set as the current recording
   */
  public setCurrentRecording = (recording: Recordings | undefined) => {
    GlobalStore.removeRecording();

    this.currentRecording = recording;

    if (!this.currentRecording) {
      GlobalStore.removeRecording();
      this.recordingsDataModel = undefined;
      return;
    }

    this.recordingsDataModel = new RecordingsDataModel(
      this.currentRecording.id
    );
    GlobalStore.setRecording('currentRecording', this.currentRecording);
  };

  /**
   * @param recordingId the id of the recording to get the data
   * @returns the stored data of the recording
   */
  public getRecordingData = async (
    recordingId: number
  ): Promise<Recordings | undefined> => {
    return await getConnection()
      .createQueryBuilder()
      .select()
      .from(Recordings, '')
      .where(`id = ${recordingId}`)
      .getRawOne();
  };

  /**
   * Creates a new recording record in the database.
   */
  public createNewRecording = async (data: INewRecordingData): Promise<any> => {
    try {
      const _newRecording = new Recordings();
      Object.assign(_newRecording, data);

      // Add probe info to the recording settings
      const probeInfo = ProbesManager.getCurrentProbe();
      _newRecording.settings = JSON.stringify(probeInfo) || '';

      const newRecording = await _newRecording.save();

      // Set the current experiment after successful creation
      this.setCurrentRecording(newRecording);

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
   * Gets all recordings related to the given patient
   * @param patientId
   */
  public getAllRecordings = async (patientId: number): Promise<any> => {
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

export default new RecordingModel();
