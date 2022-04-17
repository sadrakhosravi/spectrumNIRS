import * as React from 'react';
import { observer } from 'mobx-react-lite';
import ChartModel from '@models/ChartModel';

// Styles
import * as styles from './channelLanes.module.scss';

// Types
import type { Chart } from '../Chart';

type ChannelLaneItemType = {
  chartIndex: number;
};

export const ChannelLaneItem = observer(({ chartIndex }: ChannelLaneItemType) => {
  const [top, setTop] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  let timeoutRef: null | NodeJS.Timeout = null;

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
  }, [chartIndex, ChartModel.charts[chartIndex]]);

  // Handles the chart resize separator click
  const handleChannelSeparatorClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const dashboard = (ChartModel.chartInstance as Chart).getDashboard();

      // Get the initial mouse position
      const initialY = e.pageY;
      const initialRelativeHeight = dashboard.getRowHeight(chartIndex);

      const separator = document.getElementById(`channel-separator-${chartIndex}`);
      separator?.classList.add(styles.ChannelSeparatorActive);
      document.body.style.cursor = 'ns-resize';

      // Assign mouse move listeners
      const onMouseMove = (mouseMoveEvent: MouseEvent) => {
        requestAnimationFrame(() => {
          const diff = (mouseMoveEvent.pageY - initialY) / 10;
          const change = diff + initialRelativeHeight;

          if (change >= 0.4) {
            const diff = (mouseMoveEvent.pageY - initialY) / 100;
            dashboard.setRowHeight(chartIndex, diff + initialRelativeHeight);
          }
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'default';
        separator?.classList.remove(styles.ChannelSeparatorActive);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [chartIndex],
  );

  // Handles the double click channel height reset
  const handleChannelSeparatorDblClick = React.useCallback(() => {
    const dashboard = (ChartModel.chartInstance as Chart).getDashboard();
    const chartLength = ChartModel.charts.length;

    for (let i = 0; i < chartLength; i++) {
      dashboard.setRowHeight(i, 1);
    }
  }, []);

  const handleSeparatorOnMouseEnter = React.useCallback(() => {
    timeoutRef = setTimeout(() => {
      const separator = document.getElementById(`channel-separator-${chartIndex}`);
      separator?.classList.add(styles.ChannelSeparatorActive);
    }, 400);
  }, []);

  const handleSeparatorOnMouseLeave = React.useCallback(() => {
    window.clearTimeout(timeoutRef as any);
    setImmediate(() => window.clearTimeout(timeoutRef as any));
    const separator = document.getElementById(`channel-separator-${chartIndex}`);
    separator?.classList.remove(styles.ChannelSeparatorActive);
  }, []);

  return (
    <div className={styles.ChannelLaneItem} style={{ top, height }}>
      <div className={styles.ChannelUI}>
        <button className={styles.ChannelInfo}>
          <span />
          <span>Name</span>
        </button>
      </div>
      <div
        title="Double click to reset all channel heights"
        id={`channel-separator-${chartIndex}`}
        className={styles.ChannelLanesSeparatorButton}
        onMouseDownCapture={handleChannelSeparatorClick}
        onDoubleClick={handleChannelSeparatorDblClick}
        onMouseEnter={handleSeparatorOnMouseEnter}
        onMouseLeave={handleSeparatorOnMouseLeave}
      />
    </div>
  );
});
