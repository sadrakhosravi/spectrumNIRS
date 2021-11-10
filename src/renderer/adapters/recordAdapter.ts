import store from '@redux/store';
import { changeRecordState } from '@redux/RecordStateSlice';

// Constants
import { DialogBoxChannels, RecordChannels } from '@utils/channels';
import { RecordState } from '@utils/constants';

const dispatch = store.dispatch;

// Creates a new recording and starts it
export const handleRecord = async () => {
  const { experimentData, recordState, sensorState, chartState } =
    store.getState();

  // If there is no experimentData, display error message.
  if (!experimentData.isDataReady) {
    window.api.invokeIPC(DialogBoxChannels.MessageBox, {
      title: 'No Recording Found',
      type: 'error',
      message: 'No Recording Found',
      detail: 'Please create a recording first.',
    });
    return;
  }

  // Check if the sensor is connected
  if (!sensorState.detectedSensor) {
    window.api.invokeIPC(DialogBoxChannels.MessageBox, {
      title: 'Sensor Mismatch Error',
      type: 'error',
      message: 'Sensor was not detected',
      detail:
        'The sensor you have selected was not detected on your system. Please attach the sensor and try again.',
    });
    return;
  }

  // Get the information to the be sent to the controller
  const patientId = experimentData.currentPatient.id;
  const { currentRecording } = experimentData;
  const sensorId = sensorState.detectedSensor.id;
  const isRawData = chartState.rawdata;

  // Check record state and decide accordingly
  if (recordState.value !== RecordState.IDLE) {
    dispatch(changeRecordState(RecordState.IDLE));
    recordState.value !== RecordState.PAUSED &&
      window.api.sendIPC(RecordChannels.Stop);
  } else {
    // Initialize the sensor controller
    await window.api.invokeIPC(RecordChannels.Init, {
      sensorId,
      patientId,
      currentRecording,
      isRawData,
    });

    // Start recording
    window.api.sendIPC(RecordChannels.Recording);

    dispatch(changeRecordState(RecordState.RECORD));
  }
};

// Pause and continue recording logic
export const handlePause = () => {
  const { recordState } = store.getState();
  if (recordState.value === 'idle') return;

  // Check the current record state and decide accordingly
  recordState.value === 'pause'
    ? dispatch(changeRecordState('continue'))
    : dispatch(changeRecordState('pause'));

  console.log(store.getState().recordState.value);
  window.api.sendIPC(RecordChannels.Base + store.getState().recordState.value);
};
