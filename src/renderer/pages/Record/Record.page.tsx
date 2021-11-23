import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Main area components
import RecordChart from 'renderer/Chart/RecordChart.component';

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';
import useLoadingState from '@hooks/useLoadingState.hook';

// Constants
import { ChartType } from 'utils/constants';
import { setRecordSidebar } from '@redux/AppStateSlice';

const RecordPage = () => {
  const isSidebarActive = useAppSelector(
    (state) => state.appState.recordSidebar
  );
  const dispatch = useAppDispatch();
  useLoadingState(false);

  return (
    <>
      <div className={`absolute top-0 left-0 h-full w-full flex`}>
        <div
          className={`h-full relative ${
            isSidebarActive
              ? 'w-[calc(100%-350px)] mr-[15px]'
              : 'w-[calc(100%-20px)]'
          }`}
        >
          <RecordChart type={ChartType.RECORD} />
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
    </>
  );
};

export default RecordPage;
