import { changeRecordState } from '@redux/RecordStateSlice';
import store from '@redux/store';

const dispatch = store.dispatch;

// Creates a new recording and starts it
export const newRecording = () => {
  const { experimentData } = store.getState();
  const { recordState } = store.getState();
  // Check if there is an experiment
  if (experimentData.currentExperiment.name) {
    const { currentPatient } = experimentData;
    const patientId = currentPatient.id;

    // Check record state and decide accordingly
    if (recordState.value !== 'idle' && recordState.value !== 'stop') {
      dispatch(changeRecordState('stop'));
    } else {
      dispatch(changeRecordState('recording'));
    }
    startRecording(patientId);
  }
};

// Pause and continue recording logic
export const pauseRecording = () => {
  const { recordState } = store.getState();

  // Check the current record state and decide accordingly
  recordState.value === 'pause'
    ? dispatch(changeRecordState('continue'))
    : dispatch(changeRecordState('pause'));

  window.api.sendRecordState(store.getState().recordState.value);
};

// Send the record state along with the patient id
export const startRecording = (patientId: number) => {
  window.api.sendRecordState(store.getState().recordState.value, patientId);
};
