import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './availableDevices.module.scss';

// Components
import { SelectableCard } from '../../Elements/SelectableCard';

// View Models
import { deviceManagerVM } from '@store';

export const AvailableDevices = observer(() => {
  React.useEffect(() => {
    deviceManagerVM.getAvailableDevices();
  }, []);

  return (
    <div>
      {deviceManagerVM.allDevices.length === 0 && (
        <span className="text-larger">Loading devices ...</span>
      )}
      {deviceManagerVM.allDevices.length !== 0 && (
        <div className={styles.AvailableDevices}>
          {deviceManagerVM.allDevices.map((device, i) => (
            <SelectableCard key={device.name + i} text={device.name} />
          ))}
        </div>
      )}
    </div>
  );
});
