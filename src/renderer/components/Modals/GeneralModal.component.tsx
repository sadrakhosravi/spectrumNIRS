import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';

// Constants
import { ModalConstants } from 'utils/constants';

interface IGeneralModal {
  title: string;
  icon: string;
  text: string;
}

const GeneralModal = ({ title, icon, text }: IGeneralModal): JSX.Element => {
  return (
    <Modal id={ModalConstants.GENERALMODAL} title={title}>
      <div>
        <img src={icon} alt="Modal Icon" />
        {text}
      </div>
    </Modal>
  );
};

export default GeneralModal;
