import store from '@redux/store';
import { ModalConstants } from '@constants/constants';
import { isLoading } from '@redux/IsLoadingSlice';

// import { changeAppState } from '@redux/AppStateSlice';
import {
  setCurrentSensor,
  setExperimentData,
} from '@redux/ExperimentDataSlice';
import { closeModal, openModal } from '@redux/ModalStateSlice';

const dispatch = store.dispatch;

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
    dispatch(closeModal());

    // Set the experiment data in the state
    dispatch(setExperimentData(newExperiment));
    dispatch(openModal(ModalConstants.NEWRECORDING));
  }
};

/**
 * Sets the currentSensor data in the ExperimentData state
 * @param data Sensor data object (id and name)
 */
export const setSensorStatus = (data: Object) => {
  dispatch(isLoading(true));
  dispatch(setCurrentSensor(data));
  dispatch(closeModal());
};
