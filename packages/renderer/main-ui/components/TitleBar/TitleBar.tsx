import React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './titleBar.module.scss';

// Logo
import Logo from '../../../assets/Logo.png';

// Icons
import { Menu } from '../Menu';
import { recordingVM } from '@viewmodels/VMStore';

export const TitleBar = observer(() => {
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
          <p>Spectrum {recordingVM.currentRecording && '- ' + recordingVM.currentRecording.name}</p>
        </div>
      </div>
    </header>
  );
});
