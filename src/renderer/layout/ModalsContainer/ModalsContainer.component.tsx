import React from 'react';

// Modals
import NewExperiment from '@forms/Experiment/Experiment.modal';
import NewPatient from '@forms/Patient/Patient.modal';
import IsLoadingModal from '@components/Modals/LoadingModal.component';
import NewRecording from '@forms/Recording/NewRecording.modal';
import OpenExperiment from '@forms/OpenExperiment/OpenExperiment.modal';
import OpenPatient from '@forms/OpenExperiment/OpenPatient.modal';
import ExportModal from '@forms/Export/ExportModal.modal';
import SelectProbe from '@forms/Probes/SelectProbe.modal';
import NewProbe from '@forms/Probes/NewProbe.modal';

const ModalsContainer = (): JSX.Element => {
  return (
    <>
      <NewExperiment />
      <NewPatient />
      <NewRecording />
      <SelectProbe />
      <NewProbe />
      <OpenExperiment />
      <OpenPatient />
      <ExportModal />
      <IsLoadingModal />
    </>
  );
};
export default ModalsContainer;
