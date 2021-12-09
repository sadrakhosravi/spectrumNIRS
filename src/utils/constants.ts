// Possible states of the application / Used mostly for routing.
export enum AppState {
  HOME = '/main/home',
  RECORDING = '/main/recording',
  RECORD = '/main/recording/record',
  REVIEW = '/main/recording/review',
  RECORD_TAB = '/tabs/recording/record',
  REVIEW_TAB = '/tabs/recording/review',
  SIGNAL_QUALITY_MONITOR = '/main/signal-quality-monitor',
}

// Record state
export enum RecordState {
  IDLE = 'idle',
  RECORD = 'record',
  PAUSED = 'pause',
  CONTINUE = 'continue',
}

// Available modals to open
export enum ModalConstants {
  NEWEXPERIMENT = 'new-experiment',
  NEWPATIENT = 'new-patient',
  NEWRECORDING = 'new-recording',
  OPEN_EXPERIMENT = 'open-experiment',
  OPEN_PATIENT = 'open-patient',
  GENERALMODAL = 'general-modal',
  EXPERIMENTSETTINGS = 'experiment-settings',
}

// Chart types available
export enum ChartType {
  RECORD = 'record',
  REVIEW = 'review',
}

// Redux Thunk status
export enum ThunkStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum Sensors {
  NO_SENSOR = '',
  NIRSV5 = 'NIRS V5',
  NIRS_BEAST = 'NIRS Beast',
}
