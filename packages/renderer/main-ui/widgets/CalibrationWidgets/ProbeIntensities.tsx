import * as React from 'react';

// Components
import { WidgetsContainer } from '/@/components/Widgets';
import { TabItem, Tabs } from '/@/components/Tabs';

export const ProbeIntensities = () => {
  return (
    <WidgetsContainer>
      <Tabs>
        <TabItem header="Global">
          <p>Test</p>
        </TabItem>
        <TabItem header="Test">
          <input />
        </TabItem>
        <TabItem header="Test">
          <input />
        </TabItem>
      </Tabs>
    </WidgetsContainer>
  );
};
