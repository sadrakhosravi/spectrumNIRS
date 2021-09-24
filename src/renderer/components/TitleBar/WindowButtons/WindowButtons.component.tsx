//Contains minimize, restore/maximize, and close button for the titlebar.

import React from 'react';
import Minimize from '@icons/minimize.svg';
import Restore from '@icons/restore.svg';
import Close from '@icons/close.svg';

const send = window.api.send;

const WindowButtons = () => {
  //Electron: minimize Window ipc
  const minimizeWindow = () => {
    send('window:minimize');
  };

  //Electron: close Window ipc
  const closeWindow = () => {
    send('window:close');
  };

  //Electron: restore Window ipc
  const restoreWindow = () => {
    send('window:restore');
  };

  return (
    <span className="text-right items-center">
      <img
        src={Minimize}
        className="window-button hover:bg-accent"
        alt="Minimize"
        onClick={minimizeWindow}
      />
      <img
        src={Restore}
        className="window-button hover:bg-accent"
        alt="Maximize/Restore"
        onClick={restoreWindow}
      />
      <img
        src={Close}
        className="window-button hover:bg-red"
        alt="Close"
        onClick={closeWindow}
      />
    </span>
  );
};

export default WindowButtons;
