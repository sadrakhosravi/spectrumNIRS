import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useAppSelector } from '@redux/hooks/hooks';

// Icons

const IsLoadingModal: React.FC = () => {
  // Local state to control open and close of the modal
  const [isOpen, setIsOpen] = useState(false);

  // Check the global is loading state
  const isLoadingState = useAppSelector((state) => state.appState.isLoading);

  // Decide based on the isLoadingState state
  useEffect(() => {
    isLoadingState ? setIsOpen(true) : setIsOpen(false);
  }, [isLoadingState]);

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto bg-dark bg-opacity-70"
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
          <div className="absolute top-1/2 left-1/2 my-10 -translate-x-1/2 -translate-y-1/2 text-center text-xl text-white">
            Loading ...
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default IsLoadingModal;
