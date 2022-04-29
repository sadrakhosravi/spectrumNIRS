import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

// Components
import { Tabs, TabItem } from '/@/components/Tabs';
import { WidgetsContainer } from '/@/components/Widgets';
import { Row, Column } from '/@/components/Elements/Grid';
import { Listbox } from '/@/components/Elements/Listbox';
import { RangeSlider } from '/@/components/Elements/RangeSlider';

// ViewModel
import { ProbeSettingsViewModel } from '@viewmodels/index';

export const probeSettingVM = new ProbeSettingsViewModel();

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

  const setPDs = (num: { name: string; value: number }) => {
    probeSettingVM.setActivePDs(num.value);
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
          <div>
            {new Array(probeSettingVM.activeLEDs).fill(0).map(() => (
              <RangeSlider min={0} max={127} />
            ))}
          </div>
        </TabItem>
      </Tabs>
    </WidgetsContainer>
  );
});
