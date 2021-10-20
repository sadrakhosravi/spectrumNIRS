import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import NewExperimentForm from './Experiment.form';

// Constants
import { ModalConstants } from 'utils/constants';

const NewExperiment: React.FC = () => {
  return (
    <Modal id={ModalConstants.NEWEXPERIMENT} title="Create a New Experiment">
      <div>
        <NewExperimentForm />
      </div>
    </Modal>
  );
};

export default NewExperiment;
