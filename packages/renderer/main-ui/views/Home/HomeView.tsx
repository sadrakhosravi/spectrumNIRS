import * as React from 'react';

// Styles
import * as styles from './home.module.scss';

// Components
import { OpenRecordings } from '/@/components/OpenRecordings';

export const HomeView = () => {
  return (
    <div className={styles.HomeContainer}>
      <OpenRecordings />
    </div>
  );
};
