import React from 'react';

// Components
import Modal from '@components/Modal/Modal.component';
import NewExperimentForm from './NewExperimentForm.component';

const NewExperiment: React.FC = () => {
  return (
    <Modal isOpen={true} title="Create a New Experiment">
      <div>
        <NewExperimentForm />
      </div>
    </Modal>
  );
};

export default NewExperiment;
