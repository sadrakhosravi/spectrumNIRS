import React from 'react';

// AppState Enum
import { appStateConstants } from 'renderer/constants/Constants';

// Containers
import HomePage from '@pages/Home/Home.page';
import RecordPage from '@pages/Record/Record.page';
import ReviewPage from '@pages/Review/Review.page';

interface IProps {
  page:
    | appStateConstants.home
    | appStateConstants.record
    | appStateConstants.review;
}

const PageRouter: React.FC<IProps> = ({ page }) => {
  let outputPage;

  // Switch to check which container to render
  switch (page) {
    case appStateConstants.home:
      outputPage = <HomePage />;
      break;

    case appStateConstants.record:
      outputPage = <RecordPage />;
      break;

    case appStateConstants.review:
      outputPage = <ReviewPage />;
      break;

    default:
      outputPage = <HomePage />;
      break;
  }

  return <main className="main-container">{outputPage}</main>;
};

export default PageRouter;
