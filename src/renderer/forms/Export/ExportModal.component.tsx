import React from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import ExportForm from '@forms/Export/Export.form';
// Constants
import { ModalConstants } from 'utils/constants';

const ExportModal: React.FC = () => {
  return (
    <Modal id={ModalConstants.EXPORT_FORM} title="Export Data">
      <div>
        <ExportForm />
      </div>
    </Modal>
  );
};

export default ExportModal;
