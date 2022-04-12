import React from 'react';

// Styles
import * as styles from './titleBar.module.scss';

// Icons
import { FiFile } from 'react-icons/fi';
import { Menu } from '../Menu';

export const TitleBar = () => {
  return (
    <header className={`${styles.TitleBar}`}>
      <div className={styles.TitleBarContainer}>
        <div className={styles.Logo}>Logo</div>
        <div className={styles.TopMenu}>
          <Menu />
        </div>
        <div className={styles.Filename}>
          <FiFile size="18" color="#ccc" />
          <p>Filename</p>
        </div>
      </div>
    </header>
  );
};
