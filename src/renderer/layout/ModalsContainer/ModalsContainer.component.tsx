import React from 'react';

// Components
import NewExperiment from '@forms/Experiment/Experiment.component';
import NewPatient from '@forms/Patient/Patient.component';

import IsLoadingModal from '@components/Modals/LoadingModal.component';

const ModalsContainer = () => {
  return (
    <>
      <NewExperiment />
      <NewPatient />
      <IsLoadingModal />
    </>
  );
};
export default ModalsContainer;
