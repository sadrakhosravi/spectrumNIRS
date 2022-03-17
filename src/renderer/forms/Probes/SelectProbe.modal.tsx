import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import SelectProbeForm from './SelectProbes.form';

// Constants
import { ModalConstants } from 'utils/constants';

const SelectProbe = () => {
  return (
    <Modal id={ModalConstants.SELECT_PROBE} title="Select a Probe">
      <div>
        <SelectProbeForm />
      </div>
    </Modal>
  );
};

export default SelectProbe;
