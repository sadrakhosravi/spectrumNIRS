import store from '@redux/store';
import { openModal } from '@redux/ModalStateSlice';

// Constants
import { ModalConstants } from '@constants/Constants';

const dispatch = store.dispatch;

// Open forms
export const openNewExperimentForm = () => {
  dispatch(openModal(ModalConstants.NEWEXPERIMENT));
};
