import React from 'react';
import ReactDOM from 'react-dom';
import render from '../node_modules/dom-serializer/lib/index';

const Modal = props => {
  //Show modal container

  return ReactDOM.createPortal(
    <div className="bg-grey1 w-3/4 h-3/4 grid">
      <div></div>
    </div>,
    document.getElementById('modal'),
  );
};

export default Modal;
