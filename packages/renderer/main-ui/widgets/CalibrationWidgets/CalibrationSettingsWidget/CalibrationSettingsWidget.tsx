import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Tabs, TabItem } from '/@/components/Tabs';
import { WidgetsContainer } from '/@/components/Widgets';

// Tabs
import { ProbeSettingsTab } from './ProbeSettingsTab';
import { ChartSettingsTab } from './ChartSettingsTab';
import { DataSettingsTab } from './DataSettingsTab';

export const CalibrationSettingsWidget = observer(() => {
  return (
    <WidgetsContainer>
      <Tabs>
        {/* Probe Settings Tab */}
        <TabItem header="Device Settings">
          <ProbeSettingsTab />
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
