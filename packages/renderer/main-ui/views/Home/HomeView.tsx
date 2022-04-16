import * as React from 'react';

// Styles
import * as styles from './home.module.scss';

// Components
import { HomeLeftArea } from './HomeLeftArea';
import { HomeRightArea } from './HomeRightArea';

export const HomeView = () => {
  return (
    <div className={styles.HomeContainer}>
      {/* Home screen header */}
      <div>
        <h1>Spectrum NIRS Software</h1>
        <p className="text-larger">A complete NIRS data acquisition software developed at IBL </p>
      </div>

      {/* Recent experiments area */}
      <div className={styles.RecentExperiment}>
        <div className={styles.LeftSide}>
          <HomeLeftArea />
        </div>
        <div className={styles.RightSide}>
          <HomeRightArea />
        </div>
      </div>
    </div>
  );
};
