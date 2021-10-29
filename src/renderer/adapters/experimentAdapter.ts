import { dispatch } from '@redux/store';
import { ModalConstants } from 'utils/constants';
import { isLoading } from '@redux/IsLoadingSlice';
// import { changeAppState } from '@redux/AppStateSlice';

// import { changeAppState } from '@redux/AppStateSlice';
import { setExperimentData } from '@redux/ExperimentDataSlice';
import { setSelectedSensor } from '@redux/SensorStateSlice';
import { closeModal, openModal } from '@redux/ModalStateSlice';
// import { RecordChannels } from '@utils/channels';

/**
 * Send the experiment data to the backend via ipc
 * @param newExpData Experiment data (currentExperiment and currentPatient)
 */
export const newExperiment = async (newExpData: object) => {
  // Set isLoading to true
  dispatch(isLoading(true));

  // Create a new experiment and await the result
  const newExperiment = await window.api.experiment.newExp(newExpData);
  console.log(newExperiment);

  if (newExperiment) {
    dispatch(closeModal());
    dispatch(setExperimentData(newExperiment));
    dispatch(openModal(ModalConstants.NEWRECORDING));
  }
};

/**
 * Sets the currentSensor data in the ExperimentData state
 * @param data Sensor data object (id and name)
 */
export const setSensorStatus = (data: Object) => {
  dispatch(setSelectedSensor(data));
  dispatch(closeModal());
};
