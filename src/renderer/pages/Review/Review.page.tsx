import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setRecordSidebar } from '@redux/AppStateSlice';

// Main area components
const Chart = React.lazy(() => import('renderer/Chart/Chart.component'));

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';

const Review = () => {
  const isSidebarActive = useAppSelector(
    (state) => state.appState.recordSidebar
  );
  const dispatch = useAppDispatch();

  const isNewWindow = useAppSelector(
    (state) => state.appState.reviewTabInNewWindow
  );

  useEffect(() => {}, []);

  return (
    <>
      {!isNewWindow && (
        <div className="h-full w-full flex">
          <div
            className={`h-full transition-all duration-150 ${
              isSidebarActive ? 'w-10/12' : 'w-full pr-4'
            }`}
          >
            <React.Suspense fallback={<p>Loading ...</p>}>
              <Chart type={ChartType.REVIEW} />
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
      )}
      {isNewWindow && (
        <p className="text-xl text-light2 p-4">
          This tab is currently opened in a new window. Please close the window
          to be able to use the Review tab here.
        </p>
      )}
    </>
  );
};

export default Review;
