import * as React from 'react';
import { ipcRenderer } from 'electron';

// Components
import { Dialog } from '../../Elements/Dialog';
import { DialogContainer } from '../../Elements/DialogContainer';

// Services
import MainWinIPCService from '../../../MainWinIPCService';

// IPC Channels
import { DeviceChannels } from '@utils/channels/DeviceChannels';
import { ListItem } from '../../Elements/ListItem/ListItem';
import { SearchInput } from '../../Form';
import { Button } from '../../Elements/Buttons';

type DeviceSelectorType = {
  open: boolean;
  closeSetter: (value: boolean) => void;
};

export const DeviceSelector = ({ open, closeSetter }: DeviceSelectorType) => {
  const [devices, setDevices] = React.useState<string[]>([]);
  const [filteredDevices, setFilteredDevices] = React.useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = React.useState('');
  const searchInputId = React.useId();

  React.useEffect(() => {
    ipcRenderer.on(DeviceChannels.ALL_DEVICE_NAME, (_event, deviceNames: string[]) => {
      setDevices(deviceNames);
      setFilteredDevices(deviceNames);
    });

    // Request data from the reader process
    MainWinIPCService.sendToReader(DeviceChannels.GET_ALL_DEVICE_NAME);

    // Focus on the search box
    document.getElementById(searchInputId)?.focus();

    // Cleanup listeners
    return () => {
      ipcRenderer.removeAllListeners(DeviceChannels.ALL_DEVICE_NAME);
    };
  }, []);

  // Handles search input changes and filters the device list.
  const handleSearchInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        setFilteredDevices(devices);
      }

      const inputVal = e.target.value.toLocaleLowerCase();
      const filteredDevices = devices.filter((deviceName) =>
        deviceName.toLocaleLowerCase().includes(inputVal),
      );
      setFilteredDevices(filteredDevices);
    },
    [devices],
  );

  // Sends the selected device to be added in the reader process.
  const handleSelectDevice = React.useCallback((deviceName: string) => {
    MainWinIPCService.sendToReader(DeviceChannels.DEVICE_ADD, deviceName);
    closeSetter(false);
  }, []);

  return (
    <Dialog open={open} closeSetter={closeSetter}>
      <DialogContainer
        title="Devices"
        searchInput={
          <SearchInput
            id={searchInputId}
            placeholder="Search for devices ..."
            onChange={handleSearchInputChange}
          />
        }
        actionButtons={<Button text="Add Device" disabled={selectedDevice === ''} />}
        closeSetter={closeSetter}
      >
        {/* Iterate over devices and display them */}
        {filteredDevices.map((deviceName) => (
          <ListItem
            key={deviceName}
            id={deviceName}
            isSelected={selectedDevice === deviceName}
            title={deviceName}
            active={true}
            setter={setSelectedDevice}
            onClick={() => handleSelectDevice(deviceName)}
            onDoubleClick={() => handleSelectDevice(deviceName)}
          />
        ))}
      </DialogContainer>
    </Dialog>
  );
};
