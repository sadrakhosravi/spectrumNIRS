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
      <div className="h-full w-full flex">
        <div
          className={`h-full transition-all duration-150 ${
            isSidebarActive ? 'w-10/12' : 'w-full pr-4'
          }`}
        >
          <React.Suspense fallback={<p>Loading ...</p>}>
            <Chart type={ChartType.RECORD} />
          </React.Suspense>
        </div>
        <div
          className={`h-full transition-all duration-150 ${
            isSidebarActive
              ? 'w-2/12 mx-3 pb-4'
              : 'w-4 bg-grey1 hover:bg-accent hover:cursor-pointer'
          }`}
          onClick={() => !isSidebarActive && dispatch(setRecordSidebar(true))}
        >
          <WidgetsContainer />
        </div>
      </div>
    </>
  );
};

export default RecordPage;
