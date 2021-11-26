import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Main area components
import RecordChart from 'renderer/Chart/RecordChart.component';

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';
import { setRecordSidebar } from '@redux/AppStateSlice';

const RecordPage = () => {
  const [recordChartLoaded, setRecordChartLoaded] = useState(false);
  const recordState = useAppSelector(
    (state) => state.experimentData.currentRecording
  );

  const location = useLocation();
  const isSidebarActive = useAppSelector(
    (state) => state.appState.recordSidebar
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (recordChartLoaded !== true) {
      location.pathname === '/main/recording/record' &&
        setRecordChartLoaded(true);
      console.log('LOCATION CHANGE');
    }
  }, [location]);

  return (
    <div
      className="h-full"
      hidden={location.pathname === '/main/recording/record' ? false : true}
    >
      <div className={`absolute top-0 left-0 h-full w-full flex`}>
        <div
          className={`h-full relative ${
            isSidebarActive
              ? 'w-[calc(100%-350px)] mr-[15px]'
              : 'w-[calc(100%-20px)]'
          }`}
        >
          <RecordChart
            recordState={recordState}
            recordChartLoaded={recordChartLoaded}
            type={ChartType.RECORD}
          />
        </div>
        <div
          className={`h-full ${
            isSidebarActive
              ? 'w-[325px]'
              : 'w-[20px] bg-grey1 hover:bg-accent hover:cursor-pointer'
          }`}
          onClick={() => !isSidebarActive && dispatch(setRecordSidebar(true))}
        >
          <WidgetsContainer type={ChartType.RECORD} />
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
