import React from 'react';

// Main area components
import Chart from 'renderer/Chart/Chart.component';

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';
import useLoadingState from '@hooks/useLoadingState.hook';

// Constants
import { ChartType } from 'utils/constants';
import ChartToolbar from 'renderer/Chart/ChartToolbar/GraphToolbar.component';

const RecordPage = () => {
  useLoadingState(false);

  return (
    <>
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
