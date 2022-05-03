import * as React from 'react';
import { toJS } from 'mobx';
import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react-lite';

// Channels
import { ReaderChannels } from '@utils/channels/ReaderChannels';

// Styles
import * as styles from './probeSettingsWidget.module.scss';

// Components
import { Row, Column } from '/@/components/Elements/Grid';
import { Listbox } from '/@/components/Elements/Listbox';
import { RangeSliderWithInput } from '/@/components/Form/RnageSliderWithInput';

// View Models
import { ProbeSettingsViewModel } from '@viewmodels/index';
export const probeSettingVM = new ProbeSettingsViewModel();

const ledIDBase = 'led-intensities-';

export const ProbeSettingsTab = observer(() => {
  const statusRef = React.useRef<HTMLSpanElement>(null);

  const LEDOptions = toJS(probeSettingVM.supportedLEDNum).map((num) => {
    return { name: num.toString(), value: num };
  });

  const PDOptions = toJS(probeSettingVM.supportedPDNum).map((num) => {
    return { name: num.toString(), value: num };
  });

  // Should be used because of the observable error in listbox setter
  const setLEDs = (num: { name: string; value: number }) => {
    probeSettingVM.setActiveLEDs(num.value);
  };

  // Sets the total number of PDS
  const setPDs = (num: { name: string; value: number }) => {
    probeSettingVM.setActivePDs(num.value);
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
              name: probeSettingVM.activeLEDs.toString(),
              value: probeSettingVM.activeLEDs,
            }}
            onChange={probeSettingVM.handleDeviceSettingsUpdate}
            setter={setLEDs}
          />
        </Column>
        <Column width="50%">
          <span>Total PDs:</span>
          <Listbox
            options={PDOptions}
            value={{
              name: probeSettingVM.activePDs.toString(),
              value: probeSettingVM.activePDs,
            }}
            onChange={probeSettingVM.handleDeviceSettingsUpdate}
            setter={setPDs}
          />
        </Column>

        {/* Adjust LED intensity */}
      </Row>
      <div className={styles.LEDIntensitiesContainer}>
        {new Array(probeSettingVM.activeLEDs).fill(0).map((_, i) => (
          <RangeSliderWithInput
            id={ledIDBase + i}
            key={i + 'range-slider'}
            title={'LED' + ++i}
            min={0}
            max={127}
            onBlur={probeSettingVM.handleDeviceSettingsUpdate}
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
