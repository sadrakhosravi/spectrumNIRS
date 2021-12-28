import React from 'react';

// Modals
import NewExperiment from '@forms/Experiment/Experiment.component';
import NewPatient from '@forms/Patient/Patient.component';
import IsLoadingModal from '@components/Modals/LoadingModal.component';
import NewRecording from '@forms/Recording/NewRecording.component';
import OpenExperiment from '@forms/OpenExperiment/OpenExperiment.component';
import OpenPatient from '@forms/OpenExperiment/OpenPatient.component';
import ExportModal from '@forms/Export/ExportModal.component';

const ModalsContainer = (): JSX.Element => {
  return (
    <>
      <NewExperiment />
      <NewPatient />
      <NewRecording />
      <OpenExperiment />
      <OpenPatient />
      <ExportModal />
      <IsLoadingModal />
    </>
  );
};
export default ModalsContainer;
