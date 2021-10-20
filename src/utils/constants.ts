// Possible states of the application / Used mostly for routing.
export enum AppState {
  HOME = 'home',
  RECORD = 'recording/record',
  REVIEW = 'recording/review',
}

// Available modals to open
export enum ModalConstants {
  NEWEXPERIMENT = 'new-experiment',
  NEWPATIENT = 'new-patient',
  NEWRECORDING = 'new-recording',
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
