import { dispatch, getState } from '@redux/store';
import { isLoading } from '@redux/IsLoadingSlice';
import { setExperimentData } from '@redux/ExperimentDataSlice';
import { setSelectedSensor } from '@redux/SensorStateSlice';
import { closeModal, openModal } from '@redux/ModalStateSlice';

// Constants
import { AppState, ModalConstants } from 'utils/constants';
import { DialogBoxChannels } from '@utils/channels';
import { changeAppState } from '@redux/AppStateSlice';

/**
 * Send the experiment data to the backend via ipc
 * @param newExpData Experiment data (currentExperiment and currentPatient)
 */
export const newExperiment = async (newExpData: object) => {
  // Set isLoading to true
  dispatch(isLoading(true));

  // Create a new experiment and await the result
  const newExperiment = await window.api.experiment.newExp(newExpData);

  if (newExperiment) {
    dispatch(setExperimentData(newExperiment));
    dispatch(closeModal());
    dispatch(openModal(ModalConstants.NEWRECORDING));
  }
};

/**
 * Sets the currentSensor data in the ExperimentData state
 * @param data Sensor data object (id and name)
 */
export const setSensorStatus = (data: Object) => {
  const { detectedSensor } = getState().sensorState;

  // Check if the detected and selected sensors match
  if (data.toString() !== detectedSensor.toString()) {
    window.api.invokeIPC(DialogBoxChannels.MessageBox, {
      title: 'Sensor Mismatch Error',
      type: 'error',
      message:
        'The sensor you have selected was not detected on your system. Please attach the sensor and try again.',
    });
    return;
  }
  dispatch(setSelectedSensor(data));
  dispatch(closeModal());
  dispatch(changeAppState(AppState.RECORD));
};
