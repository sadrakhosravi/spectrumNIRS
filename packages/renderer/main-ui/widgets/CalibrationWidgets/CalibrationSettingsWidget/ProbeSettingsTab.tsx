import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Row, Column } from '/@/components/Elements/Grid';
import { Listbox } from '/@/components/Elements/Listbox';
import { DeviceSettings } from '/@/components/Device';

// View Model
import { deviceManagerVM } from '@viewmodels/VMStore';
import { Separator } from '/@/components/Elements/Separator';

export const ProbeSettingsTab = observer(() => {
  const deviceOptions = deviceManagerVM.activeDevices.map((device) => {
    return {
      name: device.name,
      value: device.id,
    };
  });

  const [currDeviceId, setCurrDeviceId] = React.useState(deviceManagerVM.activeDevices[0].id);

  const currDevice = deviceManagerVM.activeDevices.find((device) => device.id === currDeviceId);
  const currVal = { name: currDevice?.name || '', value: currDevice?.name || '' };

  return (
    <>
      <Row>
        <Column width="33.3%">
          <span>Device:</span>
        </Column>
        <Column width="66.66%">
          <Listbox value={currVal} options={deviceOptions} setter={setCurrDeviceId} />
        </Column>
      </Row>
      <Separator />
      {currDevice && <DeviceSettings device={currDevice} />}
    </>
  );
});
