import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Tabs, TabItem } from '/@/components/Tabs';
import { WidgetsContainer } from '/@/components/Widgets';

export const GlobalFiltersWidget = observer(() => {
  return (
    <WidgetsContainer>
      <Tabs>
        {/* Probe Settings Tab */}
        <TabItem header="Filters">
          <p>Test</p>
        </TabItem>
      </Tabs>
    </WidgetsContainer>
  );
});
