import { getConnection } from 'typeorm';
import { Recordings } from 'db/entity/Recordings';
import RecordingsDataModel from './RecordingsDataModel';
import GlobalStore from '@lib/globalStore/GlobalStore';

import ProbesManager, { CurrentProbe } from './ProbesManager';
import PatientModel from './PatientModel';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';

export interface IRecordingData {
  createdAt: string;
  date: string;
  description: string;
  id: number;
  name: string;
  patient: number;
  settings: CurrentProbe;
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
    this.recordingsDataModel = undefined;
    GlobalStore.removeRecording();

    // Parse the setting
    if (recording instanceof Recordings) {
      recording.settings = JSON.parse(recording.settings as string);
    }

    this.currentRecording = recording;

    console.log(this.currentRecording);

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
      const patient = PatientModel.getCurrentPatient();

      if (!patient) return;

      const _newRecording = new Recordings();
      Object.assign(_newRecording, data);
      _newRecording.patient = patient;

      // Add probe info to the recording settings
      const probeInfo = ProbesManager.getCurrentProbe();
      _newRecording.settings = JSON.stringify(probeInfo) || '';

      const newRecording = await _newRecording.save();

      // Set the current experiment after successful creation
      this.setCurrentRecording(newRecording);

      return true;
    } catch (error: any) {
      throw new Error(error.message);
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
