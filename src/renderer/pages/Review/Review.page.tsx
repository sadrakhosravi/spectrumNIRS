import React from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setReviewSidebar } from '@redux/AppStateSlice';

// Main area components
const Chart = React.lazy(() => import('renderer/Chart/Chart.component'));

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';

const Review = () => {
  const dispatch = useAppDispatch();
  const isSidebarActive = useAppSelector(
    (state) => state.appState.reviewSidebar
  );
  console.log(isSidebarActive);

  const isNewWindow = useAppSelector(
    (state) => state.appState.reviewTabInNewWindow
  );

  return (
    <>
      {!isNewWindow && (
        <div className="h-full w-full flex gap-2">
          <div
            className={`h-full ${
              isSidebarActive
                ? 'w-[calc(100%-250px)]'
                : 'w-[calc(100%-20px)] pr-1'
            }`}
          >
            <React.Suspense fallback={<p>Loading ...</p>}>
              <Chart type={ChartType.REVIEW} />
            </React.Suspense>
          </div>
          <div
            className={`h-full ${
              isSidebarActive
                ? 'w-[250px]'
                : 'w-[20px] bg-grey1 hover:bg-accent hover:cursor-pointer'
            }`}
            onClick={() => !isSidebarActive && dispatch(setReviewSidebar(true))}
          >
            <WidgetsContainer type={ChartType.REVIEW} />
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
