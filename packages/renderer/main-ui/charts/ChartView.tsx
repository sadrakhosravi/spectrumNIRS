import * as React from 'react';

// Styles
import * as styles from './chart.module.scss';

// Classes
import { Chart } from './Chart';

export const ChartView = () => {
  React.useEffect(() => {
    const chart = new Chart('main-chart-container');

    return () => chart.cleanup();
  }, []);

  return (
    <div className={styles.ChartContainer}>
      <div className={styles.ChartChannels}></div>
      <div
        className={styles.Chart}
        id={'main-chart-container'}
        style={{ right: 0, top: 0, position: 'absolute' }}
      ></div>
    </div>
  );
};
