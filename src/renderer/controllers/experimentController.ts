import store from '@redux/store';
import { AppState } from '@constants/Constants';
import { isLoading } from '@redux/IsLoadingSlice';
import { closeModal } from '@redux/ModalStateSlice';
import { changeAppState } from '@redux/AppStateSlice';
import { setExperimentData } from '@redux/ExperimentDataSlice';

const dispatch = store.dispatch;

// Check the new experiment data and send it to the database/state
export const newExperiment = async (newExperimentData: object) => {
  // Set isLoading to true
  dispatch(isLoading(true));

  // Create a new experiment and await the result
  const newExperiment = await window.api.createNewExperiment(newExperimentData);

  if (newExperiment) {
    newExperiment && dispatch(closeModal());

    // Set the experiment data in the state
    dispatch(setExperimentData(newExperiment));

    // Change app state if experiment is created
    dispatch(changeAppState(AppState.RECORD));
  }
};
