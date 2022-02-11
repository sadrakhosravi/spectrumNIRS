import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import RecordingForm from './NewRecording.form';

// Constants
import { ModalConstants } from 'utils/constants';

const NewRecording: React.FC = () => {
  return (
    <Modal
      id={ModalConstants.NEWRECORDING}
      title="Create a New Recording"
      fixedSize={true}
    >
      <div>
        <RecordingForm />
      </div>
    </Modal>
  );
};

export default NewRecording;
