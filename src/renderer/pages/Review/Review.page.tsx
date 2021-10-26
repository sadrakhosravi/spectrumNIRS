import React, { useEffect } from 'react';

// Main area components
const Chart = React.lazy(() => import('renderer/Chart/Chart.component'));

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';

const Review = () => {
  useEffect(() => {
    // window.api.getRecording();
  });

  return (
    <>
      <div className="grid grid-cols-12 grid-rows-3 gap-4 h-full w-full">
        <div className="col-span-10 h-full row-span-3">
          <React.Suspense fallback={<p>Loading ...</p>}>
            <Chart type={ChartType.REVIEW} />
          </React.Suspense>
        </div>
        <div className="col-span-2 mr-3 row-span-3">
          <WidgetsContainer />
        </div>
      </div>
    </>
  );
};

export default Review;
