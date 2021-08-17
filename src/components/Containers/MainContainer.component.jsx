import React from 'react';

import styles from './MainContainer.module.css';

//Containers
import StartupContainer from '@container/StartupContainer.component';
import RecordReviewContainer from '@container/RecordReviewContainer.component';

const MainContainer = ({ container }) => {
  let outputContainer;

  //Switch to check which container to render
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

  return <main className={styles.MainContainer}>{outputContainer}</main>;
};

export default MainContainer;
