import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setReviewSidebar } from '@redux/AppStateSlice';

// Main area components
import ReviewChart from 'renderer/Chart/ReviewChart.component';

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';

const Review = () => {
  const [reviewChartLoaded, setReviewChartLoaded] = useState(false);

  const location = useLocation();

  const dispatch = useAppDispatch();
  const isSidebarActive = useAppSelector(
    (state) => state.appState.reviewSidebar
  );

  const isNewWindow = useAppSelector(
    (state) => state.appState.reviewTabInNewWindow
  );
  const recordState = useAppSelector(
    (state) => state.experimentData.currentRecording
  );

  useEffect(() => {
    !reviewChartLoaded &&
      location.pathname === '/main/recording/review' &&
      setReviewChartLoaded(true);
  }, [location]);

  return (
    <div
      className="h-full"
      hidden={location.pathname.includes('review') ? false : true}
    >
      {!isNewWindow && (
        <div className={`absolute top-0 left-0 h-full w-full flex`}>
          <div
            className={`h-full ${
              isSidebarActive
                ? 'w-[calc(100%-350px)] mr-[15px]'
                : 'w-[calc(100%-20px)]'
            }`}
          >
            <ReviewChart
              reviewChartLoaded={reviewChartLoaded}
              recordState={recordState}
              type={ChartType.REVIEW}
            />
          </div>
          <div
            className={`h-full ${
              isSidebarActive
                ? 'w-[325px]'
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
    </div>
  );
};

export default Review;
