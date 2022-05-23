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
import type { DeviceModelProxy } from '@models/Device/DeviceProxyModel';

// ID
const ledIDBase = 'led-intensities-';

type DeviceSettingsType = {
  device: DeviceModelProxy;
};

export const DeviceSettings = observer(({ device }: DeviceSettingsType) => {
  const statusRef = React.useRef<HTMLSpanElement>(null);
  let timeoutRef: null | NodeJS.Timeout = null;

  const PDOptions = toJS(device.PDs).map((num) => {
    return { name: num.toString(), value: num };
  });

  // Sets the total number of PDS
  const setPDs = (num: { name: string; value: number }) => {
    device.setSelectedPD(num.value);
  };

  React.useEffect(() => {
    const statusSpan = statusRef.current as HTMLSpanElement;

    const clearSpan = () => (timeoutRef = setTimeout(() => (statusSpan.innerText = ''), 3500));

    ipcRenderer.on(ReaderChannels.START, (_event, status: boolean | undefined) => {
      // Clear the timeout first
      if (timeoutRef) {
        window.clearTimeout(timeoutRef);
      }

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
      // ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_INPUT_RESPONSE);
    };
  }, []);
  return (
    <>
      <Row gap="1rem" marginBottom="2rem">
        {/* Select total number of LEDs and PDs */}

        <Column width="100%">
          <span>Selected PD:</span>
          <Listbox
            options={PDOptions}
            value={{
              name: device.selectedPD.toString(),
              value: device.selectedPD,
            }}
            setter={setPDs}
          />
        </Column>

        {/* Adjust LED intensity */}
      </Row>
      <div className={styles.LEDIntensitiesContainer}>
        {device.LEDs.map((_, i) => (
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
