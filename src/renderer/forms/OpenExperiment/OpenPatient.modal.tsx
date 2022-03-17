import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import OpenPatientForm from './OpenPatient.form';

// Constants
import { ModalConstants } from 'utils/constants';

const OpenPatient: React.FC = () => {
  return (
    <Modal id={ModalConstants.OPEN_PATIENT} title="Select Patient" size="large">
      <div className="min-h-[50vh] w-full">
        <OpenPatientForm />
      </div>
    </Modal>
  );
};

export default OpenPatient;
