import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import styles from './availableDevices.module.scss';

// Components
import { SelectableCard } from '../../Elements/SelectableCard';

// View Models
import { recordingVM } from '@store';

export const AvailableDevices = observer(() => {
  return (
    <div>
      {recordingVM.currentRecording?.deviceManager.allDevices.length === 0 && (
        <span className="text-larger">Loading devices ...</span>
      )}
      {recordingVM.currentRecording?.deviceManager.allDevices.length !== 0 && (
        <div className={styles.AvailableDevices}>
          {recordingVM.currentRecording?.deviceManager.allDevices.map(
            (device, i) => (
              <SelectableCard key={device.name + i} text={device.name} />
            )
          )}
        </div>
      )}
    </div>
  );
});
