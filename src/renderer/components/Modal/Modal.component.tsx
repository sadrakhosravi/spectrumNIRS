import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

// Icons
import CloseIcon from '@icons/close.svg';
import { setIsNewExperiment } from '@redux/NewExperimentSlice';

interface IProps {
  title: string;
  isOpen: boolean;
}

const Modal: React.FC<IProps> = (props) => {
  const { title } = props;
  let isModalOpen = false;

  const dispatch = useDispatch();

  const isNewExperiment = useSelector(
    (state: any) => state.newExperimentState.value
  );
  isModalOpen = isNewExperiment;

  /**
   * Closes the modal
   */
  function closeModal() {
    dispatch(setIsNewExperiment(false));
  }

  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto bg-dark bg-opacity-60"
          onClose={closeModal}
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
              <div className="inline-block relative w-1/2 py-6 px-12 my-8 overflow-hidden text-left align-middle transition-all transform text-white bg-grey1 shadow-xl">
                <Dialog.Title as="h1" className="text-3xl font-bold">
                  {title}
                </Dialog.Title>

                <button
                  className="absolute right-4 top-4 p-2"
                  onClick={closeModal}
                >
                  <img src={CloseIcon} width="44px" alt="CloseIcon" />
                </button>

                <div className="mt-10">{props.children}</div>

                <div className="mt-4 w-full text-center"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
