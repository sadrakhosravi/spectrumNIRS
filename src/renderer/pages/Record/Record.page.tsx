import React, { useEffect } from 'react';

// Main area components
const Chart = React.lazy(() => import('renderer/Chart/Chart.component'));

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';
import useLoadingState from '@hooks/useLoadingState.hook';

// Constants
import { ChartType } from 'utils/constants';
import ChartToolbar from 'renderer/Chart/ChartToolbar/GraphToolbar.component';

const RecordPage = () => {
  useLoadingState(false);

  useEffect(() => {
    window.api.sendIPC('window:myexam');
  });

  return (
    <>
      <div className="grid grid-cols-12 grid-rows-3 gap-4 h-full w-full">
        <div className="col-span-10 h-full row-span-3">
          <ChartToolbar />
          <React.Suspense fallback={<p>Loading ...</p>}>
            <Chart type={ChartType.RECORD} />
          </React.Suspense>
        </div>
        <div className="col-span-2 mr-3 row-span-3">
          <WidgetsContainer />
        </div>
      </div>
    </>
  );
};

export default RecordPage;
