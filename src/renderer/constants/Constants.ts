// Possible states of the application / Used mostly for routing.
export enum AppState {
  HOME = 'home',
  RECORD = 'record',
  REVIEW = 'review',
}

// Available modals to open
export enum ModalConstants {
  NEWEXPERIMENT = 'new-experiment',
  NEWPATIENT = 'new-patient',
  EXPERIMENTSETTINGS = 'experiment-settings',
}

// Chart types available
export enum ChartType {
  RECORD = 'record',
  REVIEW = 'review',
}
