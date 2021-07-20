//Contains minimize, restore/maximize, and close button for the titlebar.

import React from 'react';
import Minimize from '../../../assets/icons/minimize.svg';
import Restore from '../../../assets/icons/restore.svg';
import Close from '../../../assets/icons/close.svg';

import styles from './WindowButtons.module.css';

const WindowButtons = () => {
  return (
    <span className="text-right items-center">
      <img src={Minimize} className={styles.WindowButton} alt="Minimize" />
      <img src={Restore} className={styles.WindowButton} alt="Maximize/Restore" />
      <img src={Close} className={`${styles.WindowButton} ${styles.close}`} alt="Close" />
    </span>
  );
};

export default WindowButtons;
