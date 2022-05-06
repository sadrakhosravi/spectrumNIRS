import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { ipcRenderer } from 'electron';

// Styles
import * as styles from './deviceSettings.module.scss';

// Channels
import { ReaderChannels } from '@utils/channels';

// Components
import { Column, Row } from '../Elements/Grid';
import { Listbox } from '../Elements/Listbox';
import { RangeSliderWithInput } from '../Form/RangeSliderWithInput';

// Types
import type { DeviceModel } from '@models/Device/DeviceModel';

// ID
const ledIDBase = 'led-intensities-';

type DeviceSettingsType = {
  device: DeviceModel;
};

export const DeviceSettings = observer(({ device }: DeviceSettingsType) => {
  const statusRef = React.useRef<HTMLSpanElement>(null);

  const LEDOptions = toJS(device.LEDs).map((num) => {
    return { name: num.toString(), value: num };
  });

  const PDOptions = toJS(device.PDs).map((num) => {
    return { name: num.toString(), value: num };
  });

  // Should be used because of the observable error in listbox setter
  const setLEDs = (num: { name: string; value: number }) => {
    device.setActiveLEDs(num.value);
  };

  // Sets the total number of PDS
  const setPDs = (num: { name: string; value: number }) => {
    device.setActivePDs(num.value);
  };

  React.useEffect(() => {
    const statusSpan = statusRef.current as HTMLSpanElement;

    const clearSpan = () => setTimeout(() => (statusSpan.innerText = ''), 3500);

    ipcRenderer.on(ReaderChannels.DEVICE_INPUT_RESPONSE, (_event, status: boolean | undefined) => {
      switch (status) {
        case undefined:
          statusSpan.innerText = 'Device is not connected!';
          statusSpan.style.color = 'red';
          clearSpan();
          break;

        case false:
          statusSpan.innerText = 'Failed to update settings on device! Please try again.';
          statusSpan.style.color = 'red';
          clearSpan();
          break;

        case true:
          statusSpan.innerText = 'Sent to device successfully.';
          statusSpan.style.color = 'green';

          clearSpan();
          break;
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_INPUT_RESPONSE);
    };
  }, []);
  return (
    <>
      <Row gap="1rem" marginBottom="2rem">
        {/* Select total number of LEDs and PDs */}
        <Column width="50%">
          <span>Total LEDs:</span>
          <Listbox
            options={LEDOptions}
            value={{
              name: device.activeLEDs.toString(),
              value: device.activeLEDs,
            }}
            // onChange={device.sendDeviceSettingsToReader}
            setter={setLEDs}
          />
        </Column>
        <Column width="50%">
          <span>Total PDs:</span>
          <Listbox
            options={PDOptions}
            value={{
              name: device.activePDs.toString(),
              value: device.activePDs,
            }}
            // onChange={device.sendDeviceSettingsToReader}
            setter={setPDs}
          />
        </Column>

        {/* Adjust LED intensity */}
      </Row>
      <div className={styles.LEDIntensitiesContainer}>
        {new Array(device.activeLEDs).fill(0).map((_, i) => (
          <RangeSliderWithInput
            id={ledIDBase + i}
            key={ledIDBase + i + 'range-slider'}
            title={'LED' + ++i}
            min={0}
            max={127}
            onBlur={device.sendDeviceSettingsToReader}
          />
        ))}
      </div>
      <div>
        <span>Status: </span>
        <span className={styles.StatusSpan} ref={statusRef}></span>
      </div>
    </>
  );
});
