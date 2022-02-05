import store from '@redux/store';
import { changeRecordState } from '@redux/RecordStateSlice';

// Constants
import { DialogBoxChannels, RecordChannels } from '@utils/channels';
import { RecordState } from '@utils/constants';
import DataManager from 'renderer/DataManager/DataManager';

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

  let result: 0 | 1 = 1;
  console.log(experimentData.previousRecording);
  if (experimentData.previousRecording.hasPreviousData) {
    result = await window.api.invokeIPC(DialogBoxChannels.MessageBoxSync, {
      title: 'Warning',
      type: 'warning',
      buttons: ['Cancel', 'Continue'],
      message: 'This recording has previous data',
      detail:
        'The current recording has previous data, this will add to the existing data',
    });
    console.log(experimentData.previousRecording.timeStamp);
  }
  if (!result) return;

  // Get the information to the be sent to the controller
  const patientId = experimentData.currentPatient.id;
  const { currentRecording } = experimentData;
  const sensorId = sensorState?.currentProbe?.id as number;
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
      lastTimeStamp: experimentData.previousRecording.timeStamp,
    });

    // Start recording
    window.api.sendIPC(RecordChannels.Recording);

    dispatch(changeRecordState(RecordState.RECORD));
  }
};

export const handleRecord2 = () => {
  const { recordState } = store.getState();

  if (recordState.value === RecordState.IDLE) {
    DataManager.initDataManager();
    dispatch(changeRecordState(RecordState.RECORD));
    return;
  }

  DataManager.stopDataManager();
  dispatch(changeRecordState(RecordState.IDLE));

  return;
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

/**
 * Send a signal to the main process to start the signal quality monitor
 */
export const signalQualityMonitor = async (active: boolean) => {
  const sensorId = store.getState().sensorState.detectedSensor?.id;
  console.log(sensorId);
  if (sensorId === undefined) {
    await window.api.invokeIPC(DialogBoxChannels.MessageBox, {
      title: 'No Sensor Found',
      type: 'error',
      message: 'No Sensor was detected on the system',
      detail: 'Please attach a sensor and try again',
    });

    return false;
  }
  await window.api.invokeIPC(RecordChannels.Init, { sensorId });
  window.api.sendIPC(RecordChannels.QualityMonitor, active);

  return true;
};
