import store from '@redux/store';
import { changeRecordState } from '@redux/RecordStateSlice';

// Constants
import { DialogBoxChannels, RecordChannels } from '@utils/channels';
import { RecordState } from '@utils/constants';

const dispatch = store.dispatch;

// Creates a new recording and starts it
export const handleRecord = async () => {
  const { experimentData, recordState, sensorState } = store.getState();

  // Check if the sensor is connected
  if (!sensorState.detectedSensor) {
    window.api.invokeIPC(DialogBoxChannels.MessageBox, {
      title: 'Sensor Mismatch Error',
      type: 'error',
      message:
        'The sensor you have selected was not detected on your system. Please attach the sensor and try again.',
    });
    return;
  }

  const patientId = experimentData.currentPatient.id;
  const sensorId = sensorState.detectedSensor.id;

  // Check record state and decide accordingly
  if (recordState.value !== RecordState.IDLE) {
    dispatch(changeRecordState(RecordState.IDLE));
    window.api.sendIPC(RecordChannels.Stop);
  } else {
    dispatch(changeRecordState(RecordState.RECORD));
    await window.api.invokeIPC(RecordChannels.Init, { sensorId, patientId });
    window.api.sendIPC(RecordChannels.Recording);
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
