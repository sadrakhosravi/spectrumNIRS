import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './statusBar.module.scss';

// Components
import { StatusBarItem } from './';
import { DeviceList } from '../DeviceList';

// Icon
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

// View Model
import { deviceVM } from '@store';

export const StatusBar = observer(() => {
  return (
    <footer className={styles.StatusBar}>
      <div className={styles.LeftItems}>
        <DeviceList />
      </div>
      <div className={styles.RightItems}>
        <StatusBarItem
          icon={
            deviceVM.isDeviceConnected ? (
              <FiCheckCircle size={18} strokeWidth={2.5} color="green" />
            ) : (
              <FiXCircle size={18} strokeWidth={2.5} color="red" />
            )
          }
          text={`Beast Status: ${deviceVM.isDeviceConnected ? 'Connected' : 'Disconnected'}`}
        />
      </div>
    </footer>
  );
});
