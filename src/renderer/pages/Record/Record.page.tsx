import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Main area components
const Chart = React.lazy(() => import('renderer/Chart/Chart.component'));

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
      <div className="h-full w-full flex gap-2">
        <div
          className={`h-full ${
            isSidebarActive
              ? 'w-[calc(100%-250px)]'
              : 'w-[calc(100%-20px)] pr-1'
          }`}
        >
          <React.Suspense fallback={<p>Loading ...</p>}>
            <Chart type={ChartType.RECORD} />
          </React.Suspense>
        </div>
        <div
          className={`h-full ${
            isSidebarActive
              ? 'w-[250px]'
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
