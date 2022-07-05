import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Row, Column } from '/@/components/Elements/Grid';
import { Listbox } from '/@/components/Elements/Listbox';
import { DeviceSettings } from '/@/components/Device';

// View Model
import { recordingVM } from '@viewmodels/VMStore';
import { Separator } from '/@/components/Elements/Separator';

// Types
import type { DeviceModelProxy } from '/@/models/Device/DeviceModelProxy';

export const DeviceSettingsTab = observer(() => {
  const devicesWithProbeSettings =
    recordingVM.currentRecording?.deviceManager.activeDevices.filter(
      (device) => device.hasProbeSettings === true
    ) as DeviceModelProxy[];

  const deviceOptions = devicesWithProbeSettings.map((device) => ({
    name: device.name,
    value: device.id,
  }));

  const [currDeviceId, setCurrDeviceId] = React.useState(
    deviceOptions.length !== 0 && deviceOptions[0].value
  );

  React.useEffect(() => {
    if (!recordingVM.currentRecording) return;
    setCurrDeviceId(
      recordingVM.currentRecording.deviceManager.activeDevices.length !== 0 &&
        recordingVM.currentRecording.deviceManager.activeDevices[0].id
    );
  }, [recordingVM.currentRecording?.deviceManager.activeDevices.length]);

  const currDevice =
    recordingVM.currentRecording?.deviceManager.activeDevices.find(
      (device) => device.id === currDeviceId
    );
  const currVal = {
    name: currDevice?.name || '',
    value: currDevice?.name || '',
  };

  return recordingVM.currentRecording?.deviceManager.activeDevices.length !==
    0 ? (
    <>
      <Row>
        <Column width="33.3%">
          <span>Device:</span>
        </Column>
        <Column width="66.66%">
          <Listbox value={currVal} options={deviceOptions} setter={() => {}} />
        </Column>
      </Row>
      <Separator />
      {currDevice && <DeviceSettings device={currDevice} />}
    </>
  ) : (
    <span>No device found! Please add a device first.</span>
  );
});
