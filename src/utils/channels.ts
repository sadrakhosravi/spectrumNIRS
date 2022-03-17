//
// Constants used for IPC channels
//

// General Purpose Channels
const GeneralBase = 'general';
export const GeneralChannels = {
  LogMessage: GeneralBase + 'log-message',
};

// Experiment Channel
const ExpChannelBase = 'experiment:';
export const ExperimentChannels = {
  NewExp: ExpChannelBase + 'new-exp',
  GetAndUpdateExp: ExpChannelBase + 'get-and-update-exp',
  UpdateExp: ExpChannelBase + 'update-exp',
  deleteExperiment: ExpChannelBase + 'delete-experiment',
  getRecentExperiments: ExpChannelBase + 'get-recent-experiments',
  CloseExperiment: ExpChannelBase + 'close-experiment',
  NewPatient: ExpChannelBase + 'newPatient',
  GetAndUpdatePatient: ExpChannelBase + 'get-and-update-patient',
  RemovePatient: ExpChannelBase + 'remove-patient',
  getAllPatients: ExpChannelBase + 'get-all-patients',
  deletePatient: ExpChannelBase + 'delete-patient',
  getAllRecordings: ExpChannelBase + 'get-all-recordings',
  NewRecording: ExpChannelBase + 'newRecording',
  GetAndUpdateRecording: ExpChannelBase + 'get-and-update-recording',
  deleteRecording: ExpChannelBase + 'delete-recording',
  GetCurrentRecordingData: ExpChannelBase + 'get-current-recording-data',
};

// App State Channel
const AppStateBase = 'appState:';
export const AppStateChannels = {
  Home: AppStateBase + 'home',
  Record: AppStateBase + 'recording/record',
  Review: AppStateBase + 'recording/review',
};

// Startup Channel
const StartupBase = 'startup:';
export const StartupChannels = {
  Ready: StartupBase + 'ready',
};

// Record Channel
const RecordBase = 'record:';
export const RecordChannels = {
  Base: RecordBase,
  Init: RecordBase + 'init',
  Start: RecordBase + 'start',
  ProbeCalibration: RecordBase + 'probe-calibration',
  Stop: RecordBase + 'stop',
  Pause: RecordBase + 'pause',
  Continue: RecordBase + 'continue',
  RawData: RecordBase + 'raw-data',
  SyncIntensitiesAndGain: RecordBase + 'sync-intensities-gain',
};

// Review Tab
const ReviewTabBase = 'review:';
export const ReviewTabChannels = {
  NewWindow: ReviewTabBase + 'new-window',
  ContextMenu: ReviewTabBase + 'context-menu',
  IsNewWindowOpened: ReviewTabBase + 'new-window-opened',
};

// Dialog box
const dialogBoxBase = 'dialog:';
export const DialogBoxChannels = {
  MessageBox: dialogBoxBase + 'message-box',
  MessageBoxSync: dialogBoxBase + 'message-box-sync',
  GetSaveDialog: dialogBoxBase + 'get-save-dialog-path',
};

// USB Detection
const USBDetectionBase = 'USB-detection:';
export const USBDetectionChannels = {
  CHECK_USB: USBDetectionBase + 'check-usb',
  NIRSV5: USBDetectionBase + 'nirs-v5',
};

// Chart Channels
const ChartBase = 'chart:';
export const ChartChannels = {
  CheckForData: ChartBase + 'check-for-data',
  GetDataForInterval: ChartBase + 'get-data-for-interval',
  GetAllEvents: ChartBase + 'get-all-events',
  StreamData: ChartBase + 'stream-data',
  Event: ChartBase + 'event',
  ExportAll: ChartBase + 'export-all',
  GetExportRange: ChartBase + 'get-export-range',
};

// ProbeSetting Channels
const ProbeBase = 'probe:';
export const ProbeChannels = {
  NewProbe: ProbeBase + 'new-probe',
  SelectProbe: ProbeBase + 'select-probe',
  GetCurrentProbe: ProbeBase + 'get-current-probe',
  GetAllProbesOfDevice: ProbeBase + 'get-all-probes-of-device',
  GetProbeSettings: ProbeBase + 'get-probe-settings',
  GetProbeIntensities: ProbeBase + 'get-probe-intensities',
  UpdateProbeIntensities: ProbeBase + 'update-intensities',
  DeleteProbe: ProbeBase + 'delete-probe',
  SetProbeAsDefault: ProbeBase + 'set-probe-default',
};

// Web Socket Export Server
const ExportServerBase = 'export-server:';
export const ExportServerChannels = {
  StartServer: ExportServerBase + 'start-server',
  RestartServer: ExportServerBase + 'restart-server',
  Restarted: ExportServerBase + 'restarted',
  StopServer: ExportServerBase + 'stop-server',
  ServerInfo: ExportServerBase + 'server-info',
  ServerStatus: ExportServerBase + 'server-status',
  ServerError: ExportServerBase + 'server-error',
  ClientMessage: ExportServerBase + 'client-message',
  RemoveClient: ExportServerBase + 'remove-client',
  StartStream: ExportServerBase + 'start-stream',
  StopStream: ExportServerBase + 'stop-stream',
  PauseStream: ExportServerBase + 'pause-stream',
  ServerStopped: ExpChannelBase + 'server-stopped',
};

// User Settings
const UserSettings = 'user-settings:';
export const UserSettingsChannels = {
  AddSetting: UserSettings + 'add-settings',
  GetSetting: UserSettings + 'get-settings',
  RemoveSetting: UserSettings + 'remove-settings',
};

// Updater
const Updater = 'updater:';
export const UpdaterChannels = {
  CheckForUpdate: Updater + 'check-for-update',
  UpdateAvailable: Updater + 'update-available',
  DownloadUpdate: Updater + 'download-update',
  DownloadingUpdate: Updater + 'update-downloading',
  UpdateDownloaded: Updater + 'update-downloaded',
  InstallUpdate: Updater + 'update-install',
  NoUpdateAvailable: Updater + 'no-update-available',
};
