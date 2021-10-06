import store from '@redux/store';

export const newRecording = () => {
  const { experimentData } = store.getState();
  console.log(experimentData);
};
