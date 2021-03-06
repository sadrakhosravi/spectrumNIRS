import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Icons
import CloseIcon from '@icons/close.svg';
import { closeModal } from '@redux/ModalStateSlice';

interface IProps {
  title: string;
  id: string;
  size?: 'large' | 'small' | undefined;
  fixedSize?: boolean;
}

const Modal: React.FC<IProps> = (props) => {
  const { title, size, id, fixedSize = false } = props;
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const openedModal = useAppSelector((state) => state.modalState.value);

  let styles = 'w-3/4 max-h-5/6 h-5/6 overflow-y-auto';

  switch (size) {
    case 'large':
      styles = 'w-3/4 max-h-5/6 h-5/6 overflow-y-auto';
      break;

    case 'small':
      styles = 'w-1/3 max-h-5/6 h-5/6 overflow-y-auto';
      break;

    default:
      styles = 'w-1/2 max-h-5/6 h-5/6 overflow-y-auto';
      break;
  }

  useEffect(() => {
    openedModal === id ? setIsOpen(true) : setIsOpen(false);
  }, [openedModal]);

  // Handle close of the modal
  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <>
      <Transition
        appear
        show={isOpen}
        className="duration-150 will-change-auto"
      >
        <Dialog
          open={isOpen}
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-dark bg-opacity-70 transition-all duration-100 will-change-auto"
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
                className={`border-primary relative my-8 inline-block transform overflow-hidden rounded-md bg-grey1 py-6 px-12 text-left align-middle text-white shadow-xl transition-all will-change-auto ${styles} ${
                  fixedSize && 'min-h-[50vh] min-w-[50vw]'
                }`}
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
