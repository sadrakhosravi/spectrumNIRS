import React from 'react';
import ReactDOM from 'react-dom';

//Icons
import ErrorIcon from '@icons/error.svg';

const Modal = props => {
  //Show modal container

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 h-full w-full bg-grey1 bg-opacity-60 z-10 grid items-center justify-items-center">
      <div className="bg-dark grid auto-cols-max gap-6 grid-flow-col items-center px-10 py-6">
        <div>
          <img src={ErrorIcon} width="60rem" alt="Error Icon" />
        </div>
        <div className="text-white text-2xl">
          <h4>An error has occurred!</h4>
        </div>
      </div>
    </div>,
    document.getElementById('modal'),
  );
};

export default Modal;
