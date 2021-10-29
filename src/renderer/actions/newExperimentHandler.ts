import { openModal } from '@redux/ModalStateSlice';
import store from '@redux/store';
const { dispatch, getState, subscribe } = store;

const changeState = () => {
  console.log(getState);
  dispatch(openModal('experiment-settings'));
};

subscribe(changeState);
