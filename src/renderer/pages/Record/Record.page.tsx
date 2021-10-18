import React from 'react';

// Main area components
import Tabs from '@components/Tabs/Tabs.component';
import ChartToolbar from '@components/Chart/ChartToolbar/GraphToolbar.component';
import Chart from '@components/Chart/Chart.component';

// Sidebar components
import WidgetsContainer from '@components/Chart/Widgets/WidgetsContainer.component';
import useLoadingState from '@hooks/useLoadingState.hook';

// Constants
import { ChartType } from '@constants/constants';

const RecordPage = () => {
  useLoadingState(false);

  return (
    <>
      <Tabs />
      <div className="grid grid-cols-12 grid-rows-3 custom-height gap-4">
        <div className="col-span-10 h-full row-span-3">
          <ChartToolbar />
          <Chart type={ChartType.RECORD} />
        </div>
        <div className="col-span-2 mr-3 row-span-3">
          <WidgetsContainer />
        </div>
      </div>
    </>
  );
};

export default RecordPage;
