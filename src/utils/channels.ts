// Experiment Channel
const ExpChannelBase = 'experiment:';
export const ExperimentChannels = {
  NewExp: ExpChannelBase + 'new-exp',
  UpdateExp: ExpChannelBase + 'update-exp',
  NewPatient: ExpChannelBase + 'newPatient',
  NewRecording: ExpChannelBase + 'newRecording',
  getRecentExperiments: ExpChannelBase + 'get-recent-experiments',
  getAllPatients: ExpChannelBase + 'get-all-patients',
  getAllRecordings: ExpChannelBase + 'get-all-recordings',
  deleteExperiment: ExpChannelBase + 'delete-experiment',
  deletePatient: ExpChannelBase + 'delete-patient',
  deleteRecording: ExpChannelBase + 'delete-recording',
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
  Recording: RecordBase + 'recording',
  QualityMonitor: RecordBase + 'quality-monitor',
  Stop: RecordBase + 'stop',
  Pause: RecordBase + 'pause',
  Continue: RecordBase + 'continue',
  RawData: RecordBase + 'raw-data',
  SyncGain: RecordBase + 'gain-base',
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
  GetProbeSettings: ProbeBase + 'get-probe-settings',
  GetProbeIntensities: ProbeBase + 'get-probe-intensities',
  UpdateProbeIntensities: ProbeBase + 'update-intensities',
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
