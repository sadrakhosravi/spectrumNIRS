import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import styles from './statusBar.module.scss';

// Components
import { StatusBarItem } from '.';

// Icon
import { FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { recordingVM } from '/@/viewmodels/VMStore';

// View Model
// import { deviceManagerVM } from '@store';

export const StatusBar = observer(() => {
  return (
    <footer className={styles.StatusBar}>
      <div className={styles.LeftItems} />
      <div className={styles.RightItems}>
        {recordingVM.currentRecording?.deviceManager.activeDevices.map(
          (device, i) => (
            <StatusBarItem
              key={device.id + i}
              icon={device.isConnected ? FiCheckCircle : FiXCircle}
              text={device.name}
              iconColor={device.isConnected ? 'green' : 'red'}
              tooltip={
                device.isConnected ? 'Device Connected' : 'Device Not Connected'
              }
            />
          )
        )}
      </div>
    </footer>
  );
});
