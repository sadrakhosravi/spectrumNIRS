import React from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setReviewSidebar } from '@redux/AppStateSlice';

// Main area components
import ReviewChart from 'renderer/Chart/ReviewChart.component';

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';

const Review = () => {
  const dispatch = useAppDispatch();
  const isSidebarActive = useAppSelector(
    (state) => state.appState.reviewSidebar
  );

  const isNewWindow = useAppSelector(
    (state) => state.appState.reviewTabInNewWindow
  );

  return (
    <>
      {!isNewWindow && (
        <div className={`absolute top-0 left-0 h-full w-full flex`}>
          <div
            className={`h-full ${
              isSidebarActive
                ? 'w-[calc(100%-350px)] mr-[15px]'
                : 'w-[calc(100%-20px)]'
            }`}
          >
            <ReviewChart type={ChartType.REVIEW} />
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
    </>
  );
};

export default Review;
