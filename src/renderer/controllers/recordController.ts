import { changeRecordState } from '@redux/RecordStateSlice';
import store from '@redux/store';

const dispatch = store.dispatch;

// Creates a new recording and starts it
export const newRecording = () => {
  const { experimentData } = store.getState();
  const { recordState } = store.getState();
  // Check if there is an experiment
  if (experimentData.value.currentExperiment.name) {
    const { currentPatient } = experimentData.value;
    console.log(currentPatient);

    // Check record state and decide accordingly
    if (recordState.value !== 'idle' && recordState.value !== 'stop') {
      dispatch(changeRecordState('stop'));
    } else {
      dispatch(changeRecordState('recording'));
    }
  }
};

// Pause and continue recording logic
export const pauseRecording = () => {
  const { recordState } = store.getState();

  // Check the current record state and decide accordingly
  recordState.value === 'pause'
    ? dispatch(changeRecordState('continue'))
    : dispatch(changeRecordState('pause'));
};
