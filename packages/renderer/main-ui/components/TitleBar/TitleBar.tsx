import React from 'react';

// Styles
import * as styles from './titleBar.module.scss';

// Logo
import Logo from '../../../assets/Logo.png';

// Icons
import { Menu } from '../Menu';

export const TitleBar = () => {
  return (
    <header className={`${styles.TitleBar}`}>
      <div className={styles.TitleBarContainer}>
        <div className={styles.Logo}>
          <img src={Logo} width="28px" />
        </div>
        <div className={styles.TopMenu}>
          <Menu />
        </div>
        <div className={styles.Filename}>
          <p>Spectrum - Beast</p>
        </div>
      </div>
    </header>
  );
};
