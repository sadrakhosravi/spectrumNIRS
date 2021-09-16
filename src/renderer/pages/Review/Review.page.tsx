import React from 'react';

// Main area components
import Tabs from '@components/Tabs/Tabs.component';
import ChartToolbar from '@chart/ChartToolbar/GraphToolbar.component';
import Chart from '@chart/Chart.component';

// Sidebar components
import WidgetsContainer from '@components/Chart/Widgets/WidgetsContainer.component';

const Review = () => {
  return (
    <>
      <Tabs />
      <div className="grid grid-cols-12 grid-rows-3 custom-height gap-4">
        <div className="col-span-10 h-full row-span-3">
          <ChartToolbar />
          <Chart />
        </div>
        <div className="col-span-2 mr-3 row-span-3">
          <WidgetsContainer />
        </div>
      </div>
    </>
  );
};

export default Review;
