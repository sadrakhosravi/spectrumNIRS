import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import OpenExperimentForm from './OpenExperiment.form';

// Constants
import { ModalConstants } from 'utils/constants';

const OpenExperiment: React.FC = () => {
  return (
    <Modal
      id={ModalConstants.OPEN_EXPERIMENT}
      title="Open Experiment"
      size="large"
    >
      <div className="min-h-screen w-full">
        <OpenExperimentForm />
      </div>
    </Modal>
  );
};

export default OpenExperiment;
