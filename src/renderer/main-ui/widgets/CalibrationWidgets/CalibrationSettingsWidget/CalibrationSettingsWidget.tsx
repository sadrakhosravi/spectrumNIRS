import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Tabs, TabItem } from '/@/components/Tabs';
import { WidgetsContainer } from '/@/components/Widgets';

// Tabs
import { DeviceSettingsTab } from './DeviceSettingsTab';
import { ChartSettingsTab } from './ChartSettingsTab';
import { DataSettingsTab } from './DataSettingsTab';

export const CalibrationSettingsWidget = observer(() => {
  return (
    <WidgetsContainer>
      <Tabs>
        {/* Device Settings Tab */}
        <TabItem header="Device Settings">
          <DeviceSettingsTab />
        </TabItem>

        {/* Chart Settings Tab */}
        <TabItem header="Charts">
          <ChartSettingsTab />
        </TabItem>

        {/* Data Settings Tab */}
        <TabItem header="Data">
          <DataSettingsTab />
        </TabItem>
      </Tabs>
    </WidgetsContainer>
  );
});
