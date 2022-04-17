import * as React from 'react';
import { observer } from 'mobx-react-lite';
import ChartModel from '@models/ChartModel';

// Styles
import * as styles from './channelLanes.module.scss';

// Components
import { ChannelSettings } from './ChannelSettings';
import { ChannelActions } from './ChannelActions';

// Types
import type { Chart } from '../Chart';

type ChannelLaneItemType = {
  chartIndex: number;
};

export const ChannelLaneItem = observer(({ chartIndex }: ChannelLaneItemType) => {
  const [top, setTop] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const channelInfoRef = React.useRef<HTMLButtonElement>(null);
  let timeoutRef: null | NodeJS.Timeout = null;

  React.useEffect(() => {
    const chart = ChartModel.charts[chartIndex];
    const size = (ChartModel.chartInstance as Chart).getChartSize(chart);

    const token = chart.onResize(() => {
      setTimeout(() => {
        const size = (ChartModel.chartInstance as Chart).getChartSize(chart);

        if (size.height < 15) {
          setIsMaximized(true);
        }

        if (size.height > 15) {
          setIsMaximized(false);
        }

        setTop(size.y);
        setHeight(size.height);
      }, 50);
    });

    setTop(size.y);
    setHeight(size.height);

    return () => {
      chart.offResize(token);
    };
  }, [chartIndex, ChartModel.charts[chartIndex]]);

  // Handles the chart resize separator click
  const handleChannelSeparatorClick = React.useCallback(
    (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // TODO: Add chart resize by drag functionality

      const separator = document.getElementById(`channel-separator-${chartIndex}`);
      separator?.classList.add(styles.ChannelSeparatorActive);
      document.body.style.cursor = 'ns-resize';

      let lastTimeStamp = 0;

      // Assign mouse move listeners
      const onMouseMove = (_mouseMoveEvent: MouseEvent) => {
        requestAnimationFrame((timeStamp) => {
          // Only re-render every 10 ms
          if (!(timeStamp - lastTimeStamp > 10)) {
            return;
          }

          lastTimeStamp = timeStamp;
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

  // Mouse enter on separator
  const handleSeparatorOnMouseEnter = React.useCallback(() => {
    timeoutRef = setTimeout(() => {
      const separator = document.getElementById(`channel-separator-${chartIndex}`);
      separator?.classList.add(styles.ChannelSeparatorActive);
    }, 400);
  }, []);

  // Mouse leave on separator
  const handleSeparatorOnMouseLeave = React.useCallback(() => {
    window.clearTimeout(timeoutRef as any);
    setImmediate(() => window.clearTimeout(timeoutRef as any));
    const separator = document.getElementById(`channel-separator-${chartIndex}`);
    separator?.classList.remove(styles.ChannelSeparatorActive);
  }, []);

  // Handles the on channel name click
  const handleOpenChannelSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <>
      {!isMaximized && (
        <div className={styles.ChannelLaneItem} style={{ top, height }}>
          <div className={styles.ChannelUI}>
            <div className={styles.ChannelUIInnerContainer}>
              <button
                className={styles.ChannelInfo}
                onClick={handleOpenChannelSettings}
                ref={channelInfoRef}
              >
                <span />
                <span>Name</span>
              </button>
              <ChannelActions chartIndex={chartIndex} />
            </div>
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
      )}

      {isSettingsOpen && (
        <ChannelSettings
          parentRef={channelInfoRef.current as HTMLButtonElement}
          closeSetter={setIsSettingsOpen}
        />
      )}
    </>
  );
});
