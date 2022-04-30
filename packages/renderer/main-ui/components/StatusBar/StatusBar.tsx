import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './statusBar.module.scss';

// Components
import { StatusBarItem } from './';

// Icon
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

// View Model
import { deviceInfoVM } from '@viewmodels/Singletons/DeviceInfoViewModel';

export const StatusBar = observer(() => {
  return (
    <footer className={styles.StatusBar}>
      <div className={styles.LeftItems}></div>
      <div className={styles.RightItems}>
        <StatusBarItem
          icon={
            deviceInfoVM.isDeviceConnected ? (
              <FiCheckCircle size={18} strokeWidth={2.5} color="green" />
            ) : (
              <FiXCircle size={18} strokeWidth={2.5} color="red" />
            )
          }
          text={`Beast Status: ${deviceInfoVM.isDeviceConnected ? 'Connected' : 'Disconnected'}`}
        />
      </div>
    </footer>
  );
});
