import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Dialog } from '../../Elements/Dialog';
import { ListItem } from '../../Elements/ListItem/ListItem';
import { DialogContainer } from '../../Elements/DialogContainer';
import { SearchInput } from '../../Form';

// View models
import { deviceManagerVM } from '@store';
import { appRouterVM } from '@store';

// Services
import ServiceManager from '../../../../../services/ServiceManager';

type DeviceSelectorType = {
  open: boolean;
  closeSetter: (value: boolean) => void;
};

export const DeviceSelector = observer(({ open, closeSetter }: DeviceSelectorType) => {
  const [filteredDevices, setFilteredDevices] = React.useState(
    ServiceManager.store.deviceStore.store.allDeviceNamesAndInfo,
  );
  const searchInputId = React.useId();

  React.useEffect(() => {
    // Request data from the reader process
    deviceManagerVM.requestAllDevicesInfo();

    // Focus on the search box
    document.getElementById(searchInputId)?.focus();
  }, []);

  // Update filtered state when the device manager changes
  React.useEffect(() => {
    setFilteredDevices(ServiceManager.store.deviceStore.store.allDeviceNamesAndInfo);
  }, [ServiceManager.store.deviceStore.store.allDeviceNamesAndInfo]);

  // Handles search input changes and filters the device list.
  const handleSearchInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        setFilteredDevices(deviceManagerVM.allDevices);
      }

      const inputVal = e.target.value.toLocaleLowerCase();
      const filteredDevices = deviceManagerVM.allDevices.filter((device) =>
        device.name.toLocaleLowerCase().includes(inputVal),
      );
      setFilteredDevices(filteredDevices);
    },
    [deviceManagerVM.allDevices],
  );

  // Sends the selected device to be added in the reader process.
  const handleSelectDevice = React.useCallback((deviceName: string, isActive: boolean) => {
    const loadingStr = isActive ? 'Removing Device Module...' : 'Adding Device Module...';
    appRouterVM.setAppLoading(true, true, loadingStr, 1000);

    if (isActive) {
      deviceManagerVM.sendRemoveDeviceRequestToReader(deviceName);
      return;
    }

    deviceManagerVM.sendAddDeviceRequestToReader(deviceName);
  }, []);

  return (
    <Dialog open={open} closeSetter={closeSetter}>
      <DialogContainer
        title="Device Modules"
        searchInput={
          <SearchInput
            id={searchInputId}
            placeholder="Search for devices ..."
            onChange={handleSearchInputChange}
          />
        }
        actionButtons={<></>}
        closeSetter={closeSetter}
      >
        {/* Iterate over devices and display them */}
        {filteredDevices.map((device, i) => (
          <ListItem
            key={device.name + i}
            id={device.name}
            buttonText={device.isActive ? 'Remove Device' : 'Add Device'}
            title={device.name}
            description={'Version: 0.1.0'}
            active={device.isActive}
            onClick={() => handleSelectDevice(device.name, device.isActive)}
            onDoubleClick={() => handleSelectDevice(device.name, device.isActive)}
          />
        ))}
      </DialogContainer>
    </Dialog>
  );
});
