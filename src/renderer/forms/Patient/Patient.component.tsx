import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import PatientForm from './Patient.form';

// Constants
import { ModalConstants } from 'renderer/constants/Constants';

const NewPatient: React.FC = () => {
  return (
    <Modal id={ModalConstants.NEWPATIENT} title="Create a New Patient">
      <div>
        <PatientForm />
      </div>
    </Modal>
  );
};

export default NewPatient;
