import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

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
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const whichModal = useSelector((state: any) => state.modalState.value);

  const largeStyles =
    size === 'large'
      ? 'w-3/4 max-h-5/6 h-5/6 overflow-y-auto'
      : 'w-1/2 max-h-3/4 overflow-y-auto';

  useEffect(() => {
    whichModal === id ? setIsOpen(true) : setIsOpen(false);
  }, [whichModal]);

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto bg-dark bg-opacity-70 transition-all duration-100"
        onClose={() => dispatch(closeModal())}
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
            className={`inline-block relative py-6 px-12 my-8 overflow-hidden text-left align-middle transition-all transform text-white bg-grey1 shadow-xl rounded-md ${largeStyles}`}
          >
            <Dialog.Title as="h1" className="text-3xl font-bold">
              {title}
            </Dialog.Title>

            <button
              className="absolute right-4 top-4 p-2"
              onClick={() => dispatch(closeModal())}
            >
              <img src={CloseIcon} width="44px" alt="CloseIcon" />
            </button>

            <div className="mt-10">{props.children}</div>

            <div className="mt-4 w-full text-center"></div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
