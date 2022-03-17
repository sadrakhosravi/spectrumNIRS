import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import NewProbeForm from './NewProbe.form';

// Constants
import { ModalConstants } from 'utils/constants';

const NewProbe = () => {
  return (
    <Modal id={ModalConstants.NEW_PROBE} title="New Probe">
      <div>
        <NewProbeForm />
      </div>
    </Modal>
  );
};

export default NewProbe;
