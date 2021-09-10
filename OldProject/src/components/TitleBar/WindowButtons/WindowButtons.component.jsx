//Contains minimize, restore/maximize, and close button for the titlebar.

import React from 'react';
import Minimize from '@icons/minimize.svg';
import Restore from '@icons/restore.svg';
import Close from '@icons/close.svg';

import styles from './WindowButtons.module.css';

const { ipcRenderer } = window.require('electron');

const WindowButtons = () => {
  //Electron: minimize Window ipc
  const minimizeWindow = () => {
    ipcRenderer.send('window:minimize');
  };

  //Electron: close Window ipc
  const closeWindow = () => {
    ipcRenderer.send('window:close');
  };

  //Electron: restore Window ipc
  const restoreWindow = () => {
    ipcRenderer.send('window:restore');
  };

  return (
    <span className="text-right items-center">
      <img
        src={Minimize}
        className={`${styles.WindowButton} hover:bg-accent`}
        alt="Minimize"
        onClick={minimizeWindow}
      />
      <img
        src={Restore}
        className={`${styles.WindowButton} hover:bg-accent`}
        alt="Maximize/Restore"
        onClick={restoreWindow}
      />
      <img
        src={Close}
        className={`${styles.WindowButton} ${styles.close}`}
        alt="Close"
        onClick={closeWindow}
      />
    </span>
  );
};

export default WindowButtons;

//NEEDS TO BE REFACTORED TO A SEPERATE FILE
