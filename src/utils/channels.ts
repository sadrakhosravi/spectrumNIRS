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
