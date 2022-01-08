import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import { isLoading } from '@redux/IsLoadingSlice';

// Icons
import CloseIcon from '@icons/close.svg';
import { closeModal } from '@redux/ModalStateSlice';

interface IProps {
  title: string;
  id: string;
  size?: 'large' | undefined;
}

const Modal: React.FC<IProps> = (props) => {
  const { title, size, id } = props;
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const whichModal = useAppSelector((state) => state.modalState.value);

  const largeStyles =
    size === 'large'
      ? 'w-3/4 max-h-5/6 h-5/6 overflow-y-auto'
      : 'w-1/2 max-h-3/4 overflow-y-auto';

  useEffect(() => {
    whichModal === id ? setIsOpen(true) : setIsOpen(false);
  }, [whichModal]);

  // Handle close of the modal
  const handleClose = () => {
    dispatch(closeModal());
    dispatch(isLoading(false));
  };

  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          open={isOpen}
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-dark bg-opacity-70 transition-all duration-100 "
          onClose={handleClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="min-h-screen px-4 text-center ">
              <Dialog.Overlay className="fixed inset-0" />

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div
                className={`inline-block relative py-6 px-12 my-8 overflow-hidden text-left align-middle transition-all transform text-white bg-grey1 border-primary shadow-xl rounded-md ${largeStyles}`}
              >
                <Dialog.Title as="h1" className="text-3xl font-bold">
                  {title}
                </Dialog.Title>

                <button
                  className="absolute right-4 top-4 p-2 opacity-70 hover:opacity-100"
                  title="Close"
                  onClick={handleClose}
                >
                  <img src={CloseIcon} width="32px" alt="CloseIcon" />
                </button>

                <div className="mt-10">{props.children}</div>

                <div className="mt-4 w-full text-center"></div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
