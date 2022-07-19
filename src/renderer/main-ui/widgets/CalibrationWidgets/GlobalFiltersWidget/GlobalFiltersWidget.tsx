import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Tabs, TabItem } from '/@/components/Tabs';
import { WidgetsContainer } from '/@/components/Widgets';
import { Column, Row } from '/@/components/Elements/Grid';
import { Listbox } from '/@/components/Elements/Listbox';
import { ToggleArea } from '/@/components/Elements/ToggleArea';

// View Models

// Filter
import { cutoffFrequencies, orders } from '@models/Filters/Lowpass';
import { filterSettingsVM } from '@store';

// Prepare filter options for listbox options
const cutoffFrequenciesOptions = cutoffFrequencies.map((freq) => {
  return { name: freq.toString(), value: freq };
});
const ordersOptions = orders.map((order) => {
  return { name: order.toString(), value: order };
});

export const GlobalFiltersWidget = observer(() => {
  return (
    <WidgetsContainer>
      <Tabs>
        <TabItem header="Filters">
          <ToggleArea
            isActive={filterSettingsVM.isActive}
            setter={(value) => filterSettingsVM.setIsActive(value)}
          >
            {/* Cutoff Frequency Option */}
            <Row marginBottom="1rem" marginTop="1rem">
              <Column width="33.3%">
                <span>Cutoff Freq:</span>
              </Column>
              <Column width="66.66%">
                <Listbox
                  options={cutoffFrequenciesOptions}
                  setter={(value) => {
                    filterSettingsVM.setCutoffFrequency(value.value);
                  }}
                  value={{
                    name: filterSettingsVM.cutoffFrequency.toString(),
                    value: filterSettingsVM.cutoffFrequency,
                  }}
                  height={120}
                />
              </Column>
            </Row>

            {/* Order Option */}
            <Row>
              <Column width="33.3%">
                <span>Order:</span>
              </Column>
              <Column width="66.66%">
                <Listbox
                  options={ordersOptions}
                  setter={(value) => {
                    filterSettingsVM.setOrder(value.value);
                  }}
                  value={{
                    name: filterSettingsVM.order.toString(),
                    value: filterSettingsVM.order,
                  }}
                  height={80}
                />
              </Column>
            </Row>
          </ToggleArea>
        </TabItem>
      </Tabs>
    </WidgetsContainer>
  );
});
