import React from 'react';

import Widget from '../../components/Widget/Widget.component';
import Tabs from '@components/Tabs/Tabs.component';

//Renders the filter widget on the sidebar
const Filter = () => {
  return (
    <Widget span="2">
      <Tabs>
        <Tabs.Tab label="Filter">
          <p className="text-white text-opacity-30">
            This feature is under development!
          </p>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default Filter;
