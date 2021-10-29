import { openModal } from '@redux/ModalStateSlice';
import store from '../store';
const { dispatch } = store;

export const test = () => dispatch(openModal('experiments-setting'));
