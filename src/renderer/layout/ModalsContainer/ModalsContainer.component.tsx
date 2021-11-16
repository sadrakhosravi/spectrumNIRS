import React from 'react';

// Modals
import NewExperiment from '@forms/Experiment/Experiment.component';
import NewPatient from '@forms/Patient/Patient.component';
import IsLoadingModal from '@components/Modals/LoadingModal.component';
import NewRecording from '@forms/Recording/Recording.component';
import OpenExperiment from '@forms/OpenExperiment/OpenExperiment.component';
import OpenPatient from '@forms/OpenExperiment/OpenPatient.component';

const ModalsContainer = (): JSX.Element => {
  return (
    <>
      <NewExperiment />
      <NewPatient />
      <NewRecording />
      <OpenExperiment />
      <OpenPatient />
      <IsLoadingModal />
    </>
  );
};
export default ModalsContainer;
