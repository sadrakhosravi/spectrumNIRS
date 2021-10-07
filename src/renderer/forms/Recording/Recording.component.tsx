import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import RecordingForm from './Recording.form';

// Constants
import { ModalConstants } from 'renderer/constants/Constants';

const NewRecording: React.FC = () => {
  return (
    <Modal id={ModalConstants.NEWRECORDING} title="Create a New Recording">
      <div>
        <RecordingForm />
      </div>
    </Modal>
  );
};

export default NewRecording;
