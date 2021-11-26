import { dispatch, getState } from '@redux/store';
import {
  setExperimentData,
  setPatientData,
  setRecordingData,
  resetRecordingData,
} from '@redux/ExperimentDataSlice';
import { setSelectedSensor } from '@redux/SensorStateSlice';
import { closeModal, openModal } from '@redux/ModalStateSlice';
import { setInitialState } from '@redux/ChartSlice';
import { changeRecordState } from '@redux/RecordStateSlice';

// Constants
import { AppState, ModalConstants, RecordState } from 'utils/constants';
import {
  DialogBoxChannels,
  ExperimentChannels,
  RecordChannels,
} from '@utils/channels';
import { changeAppState } from '@redux/AppStateSlice';

// Interfaces
import { INewPatientData, INewRecordingData } from 'interfaces/interfaces';

/**
 * Send the experiment data to the backend via ipc
 * @param newExpData Experiment data (currentExperiment and currentPatient)
 */
export const newExperiment = async (newExpData: object) => {
  // Set isLoading to true

  // Create a new experiment and await the result
  const newExperiment = await window.api.invokeIPC(
    ExperimentChannels.NewExp,
    newExpData
  );

  if (newExperiment) {
    dispatch(setExperimentData(newExperiment));
    dispatch(resetRecordingData());
    dispatch(closeModal());
    dispatch(openModal(ModalConstants.NEWRECORDING));
  }
};

/**
 * Sets the patient data in the state and sends it to the controller.
 * @param data - Patient data from the patient form
 */
export const newPatient = async (data: INewPatientData) => {
  // Add the current experiment Id to the data
  const experimentId: number = getState().experimentData.currentExperiment.id;
  data.experiment = experimentId;

  // Send the prepared data to the controller
  const newPatient = await window.api.invokeIPC(
    ExperimentChannels.NewPatient,
    data
  );
  dispatch(setPatientData(newPatient));
  dispatch(closeModal());
  dispatch(openModal(ModalConstants.NEWRECORDING));
};

/**
 * Sets the recording status in the experimentDataState
 * @param data - Recording data from Recording form
 */
export const newRecording = async (data: INewRecordingData) => {
  // Add the current patient Id to the data
  const patientId = getState().experimentData.currentPatient.id;
  const recordState = getState().recordState.value;
  data.patient = patientId;

  // Send the data to the controller
  const newRecording = await window.api.invokeIPC(
    ExperimentChannels.NewRecording,
    data
  );
  dispatch(resetRecordingData());
  dispatch(setRecordingData(newRecording));
  dispatch(setInitialState());

  recordState !== RecordState.IDLE &&
    recordState !== RecordState.PAUSED &&
    window.api.sendIPC(RecordChannels.Stop);
  dispatch(changeRecordState(RecordState.IDLE));
};

/**
 * Sets the currentSensor data in the ExperimentData state
 * @param data Sensor data object (id and name)
 */
export const setSensorStatus = (data: {}) => {
  const { detectedSensor } = getState().sensorState;

  // Check if the detected and selected sensors match
  if (data.toString() !== detectedSensor?.toString()) {
    window.api.invokeIPC(DialogBoxChannels.MessageBox, {
      title: 'Sensor Mismatch Error',
      type: 'warning',
      message: 'Sensor was not detected',
      detail:
        'The sensor you have selected was not detected on your system. In order to start a recording, you need to attach the sensor first',
    });
  }
  dispatch(setSelectedSensor(data));
  dispatch(closeModal());
  dispatch(changeAppState(AppState.RECORD));
};
