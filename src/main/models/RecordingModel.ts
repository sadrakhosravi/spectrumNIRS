import { getConnection } from 'typeorm';
import { Recordings } from 'db/entity/Recordings';
import RecordingsDataModel from './RecordingsDataModel';
import GlobalStore from '@lib/globalStore/GlobalStore';

import ProbesManager, { CurrentProbe } from './ProbesManager';
import PatientModel from './PatientModel';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';
import { IDeviceSettings } from './DeviceReader/DeviceReader';

import RecordingsData from 'db/entity/RecordingsData';

import DBDataParser from './DBDataParser';

import DatabaseError from './DatabaseError';

export interface ITOIThreshold {
  minimum: number;
  maximum: number;
  threshold: boolean;
}

export interface IRecordingSetting {
  TOIThreshold: ITOIThreshold | undefined;
}

export interface IProbeSettings {
  probe: CurrentProbe | undefined;
}

export interface IRecordingData {
  createdAt: string;
  date: string;
  description: string;
  id: number;
  name: string;
  patient: number;
  settings: any;
  probeSettings: any;
  deviceSettings: any;
  other: any;
  lastUpdate: string;
  updatedAt: string;
}

// The default settings
const settings: IRecordingSetting = {
  TOIThreshold: undefined,
};

class RecordingModel {
  currentRecording: IRecordingData | undefined;
  recordingsDataModel: RecordingsDataModel | undefined;
  lastTimeStamp: number;
  defaultCompressionAlgorithm: string;
  defaultSerializationAlgorithm: string;

  constructor() {
    this.currentRecording = undefined;
    this.recordingsDataModel = undefined;
    this.lastTimeStamp = 0;

    this.defaultCompressionAlgorithm = 'snappy';
    this.defaultSerializationAlgorithm = 'avro';
  }

  /**
   * @returns the current recording
   */
  public getCurrentRecording = () => this.currentRecording;

  /**
   * Sets the current recording data
   * @param recording - the recording to be set as the current recording
   */
  public setCurrentRecording = async (recording: Recordings | undefined) => {
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

    // Process the settings
    this.processRecordingSettings();

    GlobalStore.setRecording('currentRecording', this.currentRecording);

    const lastTimeSequence = await this.getCurrentRecordingLastTimeStamp();
    this.lastTimeStamp = lastTimeSequence || 0;

    GlobalStore.setRecording('lastTimeStamp', this.lastTimeStamp);

    console.log(this.currentRecording);
    console.log(this.lastTimeStamp);
  };

  /**
   * Processes recording settings saved in the database and parses its values
   */
  private processRecordingSettings() {
    if (!this.currentRecording) return;

    const settings = this.currentRecording.settings;
    const probeSettings = this.currentRecording.probeSettings;
    const deviceSettings = this.currentRecording.deviceSettings;
    const other = this.currentRecording.other;

    if (typeof settings === 'string')
      this.currentRecording.settings = JSON.parse(
        this.currentRecording?.settings
      );
    if (typeof probeSettings === 'string')
      this.currentRecording.probeSettings = JSON.parse(
        this.currentRecording.probeSettings
      );
    if (typeof deviceSettings === 'string')
      this.currentRecording.deviceSettings = JSON.parse(
        this.currentRecording.deviceSettings
      );
    if (typeof other === 'string')
      this.currentRecording.other = JSON.parse(this.currentRecording.other);
  }

  /**
   * @returns the last timeStamp of the recording or undefined
   */
  public getCurrentRecordingLastTimeStamp = async () => {
    const lastRecord = await getConnection()
      .createQueryBuilder()
      .select()
      .from(RecordingsData, '')
      .where(`recordingId = ${this.currentRecording?.id}`)
      .orderBy({
        timeSequence: 'DESC',
      })
      .getRawOne();

    if (lastRecord && lastRecord.data.length !== 0) {
      const lastRecordUnpacked = DBDataParser.parseBlobData(lastRecord.data);

      const lastTimeSequence =
        lastRecord.timeSequence + lastRecordUnpacked.length * 10;
      this.lastTimeStamp = lastTimeSequence;

      return lastTimeSequence;
    }

    this.lastTimeStamp = 0;
    return 0;
  };

  /**
   * @returns the cached value of the last timestamp of the current recording
   */
  public getLastTimeStamp = () => this.lastTimeStamp;

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

  public saveDeviceSettings = async (deviceSettings: IDeviceSettings) => {
    try {
      // Current recording
      const recordingId = this.getCurrentRecording()?.id;
      if (!recordingId) return;

      // Current probe object
      const currentProbe = ProbesManager.getCurrentProbe();
      if (!currentProbe) return;

      // Check if the current recording has data
      const currentRec = await getConnection()
        .createQueryBuilder()
        .select()
        .from(Recordings, '')
        .where(`id = ${this.currentRecording?.id}`)
        .getRawOne<Recordings>();

      // If there's already a probe/device settings return
      if (currentRec?.probeSettings || currentRec?.deviceSettings) return;

      const other = {
        compression: this.defaultCompressionAlgorithm,
        serialization: this.defaultSerializationAlgorithm,
      };

      const currentProbeAsString = JSON.stringify(currentProbe);
      const deviceSettingsAsString = JSON.stringify(deviceSettings);
      const otherAsString = JSON.stringify(other);

      await getConnection()
        .createQueryBuilder()
        .update(Recordings)
        .set({
          probeSettings: currentProbeAsString,
          deviceSettings: deviceSettingsAsString,
          other: otherAsString,
        })
        .where(`id = ${this.currentRecording?.id}`)
        .execute();

      if (!this.currentRecording) return;

      this.currentRecording.probeSettings = currentProbe;
      this.currentRecording.deviceSettings = deviceSettings;
      this.currentRecording.other = other;

      GlobalStore.setRecording('currentRecording', this.currentRecording);
    } catch (error: any) {
      new DatabaseError(error.message);
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
