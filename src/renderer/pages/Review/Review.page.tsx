import React from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setReviewSidebar } from '@redux/AppStateSlice';

// Components
import Page from '@components/Page/Page.component';
import ReviewChart from 'renderer/charts/ReviewChart.component';

// Constants
import { SidebarType } from 'utils/constants';

const Review = () => {
  const dispatch = useAppDispatch();
  const sidebarStatus = useAppSelector((state) => state.appState.reviewSidebar);
  // const isNewWindow = useAppSelector(
  //   (state) => state.appState.reviewTabInNewWindow
  // );

  return (
    <Page
      sidebarType={SidebarType.REVIEW}
      sidebarState={sidebarStatus}
      onSidebarClick={() => dispatch(setReviewSidebar(!sidebarStatus))}
    >
      <ReviewChart />
    </Page>
  );
};

export default Review;
