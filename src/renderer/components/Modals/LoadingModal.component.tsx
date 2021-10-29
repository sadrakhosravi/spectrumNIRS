import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useSelector } from 'react-redux';

// Icons

const IsLoadingModal: React.FC = () => {
  // Local state to control open and close of the modal
  const [isOpen, setIsOpen] = useState(false);

  // Check the global is loading state
  const isLoadingState = useSelector(
    (state: any) => state.isLoadingState.value
  );

  // Decide based on the isLoadingState state
  useEffect(() => {
    isLoadingState ? setIsOpen(true) : setIsOpen(false);
  }, [isLoadingState]);

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="fixed inset-0 z-30 overflow-y-auto bg-dark bg-opacity-70"
        onClose={() => ''}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="lds-ring lds-large">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default IsLoadingModal;
