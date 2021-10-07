import store from '@redux/store';
import { openModal } from '@redux/ModalStateSlice';

// Constants
import { ModalConstants } from '@constants/Constants';

const dispatch = store.dispatch;

// Opens the new experiment form
export const openNewExperimentForm = () => {
  dispatch(openModal(ModalConstants.NEWEXPERIMENT));
};

// Opens the new patient form
export const openNewPatientForm = () => {
  dispatch(openModal(ModalConstants.NEWPATIENT));
};

// Opens the new recording form
export const openNewRecordingForm = () => {
  dispatch(openModal(ModalConstants.NEWRECORDING));
};
