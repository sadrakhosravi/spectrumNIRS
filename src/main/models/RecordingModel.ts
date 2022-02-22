import { getConnection } from 'typeorm';
import { Recordings } from 'db/entity/Recordings';
import RecordingsDataModel from './RecordingsDataModel';
import GlobalStore from '@lib/globalStore/GlobalStore';

import ProbesManager, { CurrentProbe } from './ProbesManager';
import PatientModel from './PatientModel';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';
import RecordingsData from 'db/entity/RecordingsData';

export interface ITOIThreshold {
  min: number;
  max: number;
}

export interface IRecordingSetting {
  TOIThreshold: ITOIThreshold | undefined;
}

export interface IRecordingSettingDefault {
  probe: CurrentProbe | undefined;
}

export interface IRecordingData {
  createdAt: string;
  date: string;
  description: string;
  id: number;
  name: string;
  patient: number;
  settings: IRecordingSetting & IRecordingSettingDefault;
  updatedAt: string;
}

// The default settings
const settings: IRecordingSetting & IRecordingSettingDefault = {
  probe: undefined,
  TOIThreshold: undefined,
};

class RecordingModel {
  currentRecording: IRecordingData | undefined;
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

    this.currentRecording = recording as any;

    if (!this.currentRecording) {
      GlobalStore.removeRecording();
      this.recordingsDataModel = undefined;
      return;
    }

    this.recordingsDataModel = new RecordingsDataModel(
      this.currentRecording.id
    );
    GlobalStore.setRecording('currentRecording', this.currentRecording);
    console.log('NEW RECORDING CREATED');
    console.log(this.currentRecording.settings);
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
  public createNewRecording = async (
    data: INewRecordingData,
    settingsData?: IRecordingSetting
  ): Promise<any> => {
    try {
      const patient = PatientModel.getCurrentPatient();

      if (!patient) return;

      const _newRecording = new Recordings();

      Object.assign(_newRecording, data);
      _newRecording.patient = patient;

      // Add other settings if exists
      if (settingsData) {
        Object.assign(settings, settingsData);
      }

      // Add probe info to the recording settings
      // Should be added last for it not to be overwritten
      const probeInfo = ProbesManager.getCurrentProbe();
      settings.probe = probeInfo;

      // Stringify the settings before inserting it to the DB
      _newRecording.settings = JSON.stringify(settings);

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

  public getCurrentRecordingData = async () => {
    if (this.currentRecording?.id) {
      const dataChunk = await getConnection()
        .createQueryBuilder()
        .select()
        .from(RecordingsData, '')
        .where(`recordingId = ${this.currentRecording?.id}`)
        .limit(10000)
        .getRawMany();

      return dataChunk;
    }

    return undefined;
  };
}

export default new RecordingModel();
