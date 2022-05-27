import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Row, Column } from '/@/components/Elements/Grid';
import { Listbox } from '/@/components/Elements/Listbox';
import { DeviceSettings } from '/@/components/Device';

// View Model
import { deviceManagerVM } from '@viewmodels/VMStore';
import { Separator } from '/@/components/Elements/Separator';

export const DeviceSettingsTab = observer(() => {
  const devicesWithProbeSettings = deviceManagerVM.activeDevices.filter(
    (device) => device.hasProbeSettings === true,
  );

  const deviceOptions = devicesWithProbeSettings.map((device) => ({
    name: device.name,
    value: device.id,
  }));

  const [currDeviceId, setCurrDeviceId] = React.useState(
    deviceOptions.length !== 0 && deviceOptions[0].value,
  );

  React.useEffect(() => {
    setCurrDeviceId(
      deviceManagerVM.activeDevices.length !== 0 && deviceManagerVM.activeDevices[0].id,
    );
  }, [deviceManagerVM.activeDevices.length]);

  const currDevice = deviceManagerVM.activeDevices.find((device) => device.id === currDeviceId);
  const currVal = { name: currDevice?.name || '', value: currDevice?.name || '' };

  return deviceManagerVM.activeDevices.length !== 0 ? (
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
