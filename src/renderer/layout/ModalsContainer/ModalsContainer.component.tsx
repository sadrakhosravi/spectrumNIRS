import React from 'react';

// Components
import NewExperiment from '@forms/Experiment/Experiment.component';
import NewPatient from '@forms/Patient/Patient.component';

import IsLoadingModal from '@components/Modals/LoadingModal.component';
import NewRecording from '@forms/Recording/Recording.component';

const ModalsContainer = () => {
  return (
    <>
      <NewExperiment />
      <NewPatient />
      <NewRecording />
      <IsLoadingModal />
    </>
  );
};
export default ModalsContainer;
