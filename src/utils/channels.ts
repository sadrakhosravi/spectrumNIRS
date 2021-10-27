// Experiment Channel
const ExpChannelBase = 'experiment:';
export const ExperimentChannels = {
  NewExp: ExpChannelBase + 'newExp',
  NewPatient: ExpChannelBase + 'newPatient',
  NewRecording: ExpChannelBase + 'newRecording',
  getRecentExperiments: ExpChannelBase + 'get-recent-experiments',
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
};

// USB Detection
const USBDetectionBase = 'USB-detection:';
export const USBDetectionChannels = {
  CHECK_USB: USBDetectionBase + 'check-usb',
  NIRSV5: USBDetectionBase + 'nirs-v5',
};
