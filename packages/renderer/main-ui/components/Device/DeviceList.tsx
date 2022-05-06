import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './deviceList.module.scss';

// Components
import { Popover } from '../Elements/Popover/Popover';
import { ButtonIconText } from '../Elements/Buttons';
import { DeviceListItem } from './DeviceListItem';

// Icons
import { FiServer, FiRefreshCcw } from 'react-icons/fi';

// View Model
import { deviceManagerVM } from '@store';

export const DeviceList = observer(() => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <ButtonIconText
        buttonRef={buttonRef}
        icon={<FiServer size="16px" />}
        text="Devices"
        dropDownIndicator
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Popover
          buttonRef={buttonRef.current as HTMLButtonElement}
          closeSetter={setIsOpen}
          title="Devices"
        >
          {/* List all active devices */}
          {deviceManagerVM.activeDevices.map((device) => (
            <DeviceListItem
              key={device.id}
              name={device.name}
              isConnected={device.isDeviceConnected}
            />
          ))}

          <ButtonIconText
            className={styles.DeviceListRefreshButton}
            text="Refresh"
            icon={<FiRefreshCcw size="15px" strokeWidth={3} />}
          />
        </Popover>
      )}
    </>
  );
});
