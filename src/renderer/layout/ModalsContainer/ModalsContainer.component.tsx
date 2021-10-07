import React from 'react';

// Components
import NewExperiment from '@forms/Experiment/Experiment.component';
import IsLoadingModal from '@components/Modals/LoadingModal.component';

const ModalsContainer = () => {
  return (
    <>
      <NewExperiment />
      <IsLoadingModal />
    </>
  );
};
export default ModalsContainer;
