import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './deviceList.module.scss';

// HOC

// Components
import { Popover } from '../Elements/Popover/Popover';
import { ButtonIconText } from '../Elements/Buttons';
import { DeviceListItem } from './DeviceListItem';
import { DeviceSelector } from './DeviceSelector/DeviceSelector';

// Icons
import { FiServer, FiRefreshCcw } from 'react-icons/fi';

// View Model
import { deviceManagerVM } from '@store';

export const ActiveDeviceList = observer(() => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddDeviceOpen, setAddDeviceOpen] = React.useState(false);

  return (
    <>
      <ButtonIconText
        buttonRef={buttonRef}
        icon={<FiServer size="16px" />}
        text="Devices"
        dropDownIndicator
        onClick={() => setIsOpen(true)}
        disabled={deviceManagerVM.isRecordingData}
      />
      {isOpen && (
        <Popover
          buttonRef={buttonRef.current as HTMLButtonElement}
          closeSetter={setIsOpen}
          title="Devices"
          height={350}
        >
          <div className={styles.DeviceListContainer}>
            {/* List all active devices */}
            {deviceManagerVM.activeDevices.map((device) => (
              <DeviceListItem
                key={device.id}
                name={device.name}
                isConnected={device.isDeviceConnected}
              />
            ))}
          </div>

          <div className={styles.ActionButtons}>
            <ButtonIconText
              text="Add/Remove Device"
              icon={<FiServer size="15px" strokeWidth={3} />}
              onClick={() => setAddDeviceOpen(true)}
            />
            <ButtonIconText text="Refresh" icon={<FiRefreshCcw size="15px" strokeWidth={3} />} />
          </div>
        </Popover>
      )}

      {isAddDeviceOpen && <DeviceSelector open={isAddDeviceOpen} closeSetter={setAddDeviceOpen} />}
    </>
  );
});
