import React from 'react';

// Containers
import StartupContainer from '@container/StartupContainer.component';
import RecordReviewContainer from '@container/RecordReviewContainer.component';

interface IProps {
  container: 'startContainer' | 'recordContainer';
}

const MainContainer: React.FC<IProps> = ({ container }) => {
  let outputContainer;

  // Switch to check which container to render
  switch (container) {
    case 'startContainer':
      outputContainer = <StartupContainer />;
      break;
    case 'recordContainer':
      outputContainer = <RecordReviewContainer />;
      break;

    default:
      outputContainer = <StartupContainer />;
  }

  return <main className="main-container">{outputContainer}</main>;
};

export default MainContainer;
