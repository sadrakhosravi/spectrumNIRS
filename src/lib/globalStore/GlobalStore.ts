import Store from 'electron-store';

// Types / Interfaces
import {
  IClientStatus,
  IServerInfo,
  IServerStatus,
  IDataSize,
  IDataTypes,
} from '@electron/models/ExportServer/ExportServer';
import { IExperimentData } from '@electron/models/ExperimentModel';
import { IPatientData } from '@electron/models/PatientModel';
import { IRecordingData } from '@electron/models/RecordingModel';
import { CurrentProbe } from '@electron/models/ProbesManager';
import { RecordState } from '@electron/models/DeviceReader/DeviceReader';
import { ILiveFilter } from 'filters/LiveFilter';

let storePath = '';

console.log(process.type);

(async () => {
  if (process.type === 'renderer') {
    console.log('STORE PATH');
    storePath = await window.api.invokeIPC('get-settings-path');
  } else {
    const paths = await import('@electron/paths');
    storePath = paths.settingsPath;
  }
})();

// import schema from './schema.json';

// Global store is used to share a state between the main and renderer
// processes. It relies on the electron-store module.
// Electron store uses a file based system and tracks its changes.
// The file is saved in the settings path as config.json

export interface IGlobalStore {
  exportServer: {
    serverInfo: IServerInfo;
    serverStatus: IServerStatus | null;
    clientStatus: IClientStatus[] | null;
    error: string;
    outputDataSize: IDataSize['value'];
    outputDataType: IDataTypes['value'];
    sendTo: string;
  };
  experiment: {
    currentExp: IExperimentData | null;
  };
  patient: {
    currentPatient: IPatientData | null;
  };
  recording: {
    currentRecording: IRecordingData | null;
    lastTimeStamp: number | undefined;
  };
  probe: {
    currentProbe: CurrentProbe | null;
  };
  recordState: RecordState;
  liveFilter: ILiveFilter;
  filePaths: {
    dbFile: string;
    settings: string;
  };
}

const initialState = {
  exportServer: {},
  probes: {},
};

class GlobalStore {
  store: Store<Record<string, unknown>>;
  constructor() {
    //@ts-ignore
    this.store = new Store({
      watch: true,
      cwd: storePath,
      accessPropertiesByDotNotation: true,
    });
    // Only reset the store once when the main process loads it
    if (process.type !== 'renderer') this.store.store = initialState;
  }

  /**
   * Sets the export server state value
   */
  setExportServer = (key: keyof IGlobalStore['exportServer'], value: any) =>
    this.store.set(`exportServer.${key}`, value);

  /**
   * Removes the export server key and all its values
   */
  removeExportServer = () => this.store.set('exportServer', {});

  /**
   * Gets a value from the export server state
   */
  getExportServer = (key: keyof IGlobalStore['exportServer']) =>
    this.store.get(`exportServer.${key}`);

  /**
   * Sets the experiment state value
   */
  setExperiment = (key: keyof IGlobalStore['experiment'], value: any) =>
    this.store.set(`experiment.${key}`, value);

  /**
   * Removes the experiment key and all its values
   */
  removeExperiment = () => this.store.set('experiment', {});

  /**
   * Gets a value from the experiment state
   */
  getExperiment = (key: keyof IGlobalStore['experiment']) =>
    this.store.get(`experiment.${key}`);

  /**
   * Sets the patient state value
   */
  setPatient = (key: keyof IGlobalStore['patient'], value: any) =>
    this.store.set(`patient.${key}`, value);

  /**
   * Removes the patient key and all its values
   */
  removePatient = () => this.store.set('patient', {});

  /**
   * Gets a value from the patient state
   */
  getPatient = (key: keyof IGlobalStore['patient']) =>
    this.store.get(`patient.${key}`);

  /**
   * Sets the recording state value
   */
  setRecording = (key: keyof IGlobalStore['recording'], value: any) =>
    this.store.set(`recording.${key}`, value);

  /**
   * Removes the recording key and all its values
   */
  removeRecording = () => this.store.set('recording', {});

  /**
   * Gets a value from the recording state
   */
  getRecording = (key: keyof IGlobalStore['recording']) =>
    this.store.get(`recording.${key}`);

  /**
   * Sets the probe state value
   */
  setProbe = (key: keyof IGlobalStore['probe'], value: any) =>
    this.store.set(`probe.${key}`, value);

  /**
   * Removes the probe key and all its values
   */
  removeProbe = () => this.store.set('probe', {});

  /**
   * Gets a value from the probe state
   */
  getProbe = (key: keyof IGlobalStore['probe']) =>
    this.store.get(`probe.${key}`);

  /**
   * Sets the record state value
   */
  setRecordState = (key: keyof IGlobalStore['recordState'], value: any) =>
    this.store.set(`recordState.${key}`, value);

  /**
   * Removes the record key and all its values
   */
  removeRecordState = () => this.store.set('recordState', {});

  /**
   * Gets a value from the record state
   */
  getRecordState = (key: keyof IGlobalStore['recordState']) =>
    this.store.get(`recordState.${key}`);

  /**
   * Sets the live filter state value
   */
  setLiveFilterState = (
    key: 'lowpass' | 'highpass',
    value: ILiveFilter['lowpass'] | ILiveFilter['highpass']
  ) => this.store.set(`liveFilter.${key}`, value);

  /**
   * Removes the live filter key and all its values
   */
  removeLiveFilterState = () => this.store.set('liveFilter', {});

  /**
   * Gets a value from the live filter state
   */
  getLiveFilterState = (key: keyof IGlobalStore['liveFilter']) =>
    this.store.get(`liveFilter.${key}`);

  /**
   * Sets the file path values
   */
  setFilePaths = (key: 'dbFile' | 'settings', value: string) =>
    this.store.set(`filePaths.${key}`, value);

  /**
   * Removes the file paths and all its values
   */
  removeFilePaths = () => this.store.set('filePaths', {});
}

export type GlobalStoreType = GlobalStore;
export default new GlobalStore();
