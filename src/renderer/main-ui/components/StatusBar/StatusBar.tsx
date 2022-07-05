import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import styles from './statusBar.module.scss';

// Components
import { StatusBarItem } from '.';

// Icon
import { FiXCircle } from 'react-icons/fi';
import { recordingVM } from '/@/viewmodels/VMStore';

// View Model
// import { deviceManagerVM } from '@store';

export const StatusBar = observer(() => {
  return (
    <footer className={styles.StatusBar}>
      <div className={styles.LeftItems} />
      <div className={styles.RightItems}>
        {recordingVM.currentRecording?.deviceManager.activeDevices.map(
          (device) => (
            <StatusBarItem icon={FiXCircle} text={device.name} />
          )
        )}
      </div>
    </footer>
  );
});
