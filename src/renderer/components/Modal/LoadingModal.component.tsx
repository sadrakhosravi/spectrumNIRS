import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

// Icons
import CloseIcon from '@icons/close.svg';
import { notLoading } from '@redux/IsLoadingSlice';

const IsLoadingModal: React.FC = () => {
  // Local state to control open and close of the modal
  const [isOpen, setIsOpen] = useState(false);

  // Check the global is loading state
  const isLoading = useSelector((state: any) => state.isLoadingState.value);
  const dispatch = useDispatch();

  // Decide based on the isLoading state
  useEffect(() => {
    isLoading ? setIsOpen(true) : setIsOpen(false);
  }, [isLoading]);

  const closeModal = () => {
    dispatch(notLoading);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-dark bg-opacity-60"
          onClose={() => dispatch(closeModal())}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`inline-block relative py-6 px-12 my-8 overflow-hidden text-left align-middle transition-all transform text-white bg-grey1 shadow-xl `}
              >
                <Dialog.Title as="h1" className="text-3xl font-bold">
                  "Test"
                </Dialog.Title>

                <button
                  className="absolute right-4 top-4 p-2"
                  onClick={() => dispatch(closeModal())}
                >
                  <img src={CloseIcon} width="44px" alt="CloseIcon" />
                </button>

                <div className="mt-10"></div>

                <div className="mt-4 w-full text-center"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default IsLoadingModal;
