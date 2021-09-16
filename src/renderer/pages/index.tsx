import React from 'react';

// AppState Enum
import { appStateEnum } from 'renderer/ts/appStateEnum';

// Containers
import HomePage from '@pages/Home/Home.page';
import RecordPage from '@pages/Record/Record.page';
import ReviewPage from '@pages/Review/Review.page';

interface IProps {
  page: appStateEnum.home | appStateEnum.record | appStateEnum.review;
}

const PageRouter: React.FC<IProps> = ({ page }) => {
  let outputPage;

  // Switch to check which container to render
  switch (page) {
    case appStateEnum.home:
      outputPage = <HomePage />;
      break;

    case appStateEnum.record:
      outputPage = <RecordPage />;
      break;

    case appStateEnum.review:
      outputPage = <ReviewPage />;
      break;

    default:
      outputPage = <HomePage />;
      break;
  }

  return <main className="main-container">{outputPage}</main>;
};

export default PageRouter;
