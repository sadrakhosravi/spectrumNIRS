import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import CustomEventForm from './CustomEvent.form';

// Constants
import { ModalConstants } from 'utils/constants';

const CustomEventModal: React.FC = () => {
  return (
    <Modal
      id={ModalConstants.CUSTOM_EVENT_FORM}
      title="Add Custom Event"
      size="small"
    >
      <div>
        <CustomEventForm />
      </div>
    </Modal>
  );
};

export default CustomEventModal;
