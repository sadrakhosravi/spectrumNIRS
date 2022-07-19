import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import styles from './deviceList.module.scss';

// HOC

// Components
import { Popover } from '../Elements/Popover/Popover';
import { ButtonIconText } from '../Elements/Buttons';
import { DeviceListItem } from './DeviceListItem';
import { DeviceSelector } from './DeviceSelector/DeviceSelector';

// Icons
import { FiServer, FiRefreshCcw } from 'react-icons/fi';

// View Model
import { appRouterVM, recordingVM } from '@store';
import { DeviceAdvancedSettings } from './DeviceAdvnacedSettings/DeviceAdvancedSettings';

export const ActiveDeviceList = observer(() => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const [isAddDeviceOpen, setAddDeviceOpen] = React.useState(false);
  const [isDeviceSettingOpen, setIsDeviceSettingsOpen] = React.useState(false);
  const [deviceSettings, setDeviceSettings] = React.useState<string | null>(
    null
  );

  return (
    <>
      <ButtonIconText
        buttonRef={buttonRef}
        icon={<FiServer size="16px" />}
        text="Devices"
        dropDownIndicator
        onClick={() => setIsOpen(true)}
        disabled
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
            {recordingVM.currentRecording?.deviceManager?.activeDevices.map(
              (device) => (
                <DeviceListItem
                  key={device.id}
                  name={device.name}
                  isConnected={device.isConnected}
                  onSettingsClick={() => {
                    appRouterVM.setAppLoading(
                      true,
                      true,
                      'Loading settings...'
                    );
                    setDeviceSettings(device.name);
                    setIsDeviceSettingsOpen(true);
                  }}
                />
              )
            )}
          </div>

          <div className={styles.ActionButtons}>
            <ButtonIconText
              text="Add/Remove Device"
              icon={<FiServer size="15px" strokeWidth={3} />}
              onClick={() => setAddDeviceOpen(true)}
            />
            <ButtonIconText
              text="Refresh"
              icon={<FiRefreshCcw size="15px" strokeWidth={3} />}
            />
          </div>
        </Popover>
      )}

      {isAddDeviceOpen && (
        <DeviceSelector open={isAddDeviceOpen} closeSetter={setAddDeviceOpen} />
      )}
      {isDeviceSettingOpen && deviceSettings && (
        <DeviceAdvancedSettings
          deviceName={deviceSettings}
          open={isDeviceSettingOpen}
          closeSetter={setIsDeviceSettingsOpen}
        />
      )}
    </>
  );
});
