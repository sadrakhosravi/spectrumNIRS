import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

// Styles
import * as styles from './probeSettingsWidget.module.scss';

// Components
import { Tabs, TabItem } from '/@/components/Tabs';
import { WidgetsContainer } from '/@/components/Widgets';
import { Row, Column } from '/@/components/Elements/Grid';
import { Listbox } from '/@/components/Elements/Listbox';
import { RangeSliderWithInput } from '/@/components/Form/RnageSliderWithInput';

// ViewModel
import { ProbeSettingsViewModel } from '@viewmodels/index';
import { ipcRenderer } from 'electron';

export const probeSettingVM = new ProbeSettingsViewModel();

const ledIDBase = 'led-intensities-';

export const ProbeSettingsWidget = observer(() => {
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

  // Handles the on blur event to send the data to the reader process
  const handleBlur = (_e: any) => {
    const totalLEDs = probeSettingVM.activeLEDs;
    const values: number[] = [];

    for (let i = 0; i < totalLEDs; i++) {
      const ledSlider = document.getElementById(ledIDBase + i) as HTMLInputElement;
      values.push(~~ledSlider.value);
    }

    ipcRenderer.sendTo(2, 'test', values);
  };

  return (
    <WidgetsContainer>
      <Tabs>
        {/* Probe Settings Tab */}
        <TabItem header="Probe Settings">
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
                onBlur={handleBlur}
              />
            ))}
          </div>
          <div>
            <span>Status: </span>
            <span>Sent to Controller</span>
          </div>
        </TabItem>
      </Tabs>
    </WidgetsContainer>
  );
});
