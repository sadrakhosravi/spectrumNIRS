import * as React from 'react';
import { observer } from 'mobx-react-lite';
import ChartModel from '@models/ChartModel';

// Styles
import * as styles from './channelUI.module.scss';

// Types
import type { Chart } from '../Chart';

type ChannelUIType = {
  chartIndex: number;
};

export const ChannelUI = observer(({ chartIndex }: ChannelUIType) => {
  const [height, setHeight] = React.useState(0);
  const [top, setTop] = React.useState(0);

  React.useEffect(() => {
    const chart = ChartModel.charts[chartIndex];
    const size = (ChartModel.chartInstance as Chart).getChartSize(chart);

    const token = chart.onResize(() => {
      const size = (ChartModel.chartInstance as Chart).getChartSize(chart);
      setTop(size.y);
      setHeight(size.height);
    });

    setTop(size.y);
    setHeight(size.height);

    return () => {
      chart.offResize(token);
    };
  }, [chartIndex, ChartModel.chartInstance]);

  return (
    <div className={styles.ChannelUI} style={{ height, top }}>
      <button className={styles.ChannelInfo}>
        <span />
        <span>Name</span>
      </button>
    </div>
  );
});
