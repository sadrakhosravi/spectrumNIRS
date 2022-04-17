import * as React from 'react';
import { Chart } from './Chart';
import { ChartController } from '@controllers/ChartController';

// Styles
import * as styles from './chart.module.scss';

// Components
import { ChannelLanes } from './ChannelLanes/ChannelLanes';

export const ChartView = () => {
  React.useEffect(() => {
    const chart = new Chart('main-chart-container');
    ChartController.setChartInstance(chart);

    return () => {
      chart.cleanup();
    };
  }, []);

  return (
    <div className={styles.ChartContainer}>
      <div
        className={styles.Chart}
        id={'main-chart-container'}
        style={{ right: 0, top: 0, position: 'absolute' }}
      >
        <ChannelLanes />
      </div>
    </div>
  );
};
