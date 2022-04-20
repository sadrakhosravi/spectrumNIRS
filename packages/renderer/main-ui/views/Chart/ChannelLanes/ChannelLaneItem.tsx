import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './channelLanes.module.scss';

// Components
import { ChannelSettings } from './ChannelSettings';
// import { ChannelActions } from './ChannelActions';

// Types
import type { IChart } from '@viewmodels/Chart/ChartViewModel';

type ChannelLaneItemType = {
  chart: IChart;
};

export const ChannelLaneItem = observer(({ chart }: ChannelLaneItemType) => {
  const [top, setTop] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);
  //@ts-ignore
  const [isCompact, setIsCompact] = React.useState(false);

  const channelInfoRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const size = chart.dashboardChart.getSize();

    const token = chart.dashboardChart.chart.onResize(() => {
      setTimeout(() => {
        const size = chart.dashboardChart.getSize();
        if (size.height < 15) {
          setIsMaximized(true);
        }

        if (size.height > 15) {
          setIsMaximized(false);
        }

        if (size.height < 55) {
          setIsCompact(true);
        }

        setTop(size.y);
        setHeight(size.height);
      }, 10);
    });

    setTop(size.y);
    setHeight(size.height);

    return () => {
      chart.dashboardChart.chart.offResize(token);
    };
  }, [chart]);

  // // Handles the chart resize separator click
  // const handleChannelSeparatorClick = React.useCallback(
  //   (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //     // TODO: Add chart resize by drag functionality

  //     const separator = document.getElementById(`channel-separator-${chartIndex}`);
  //     separator?.classList.add(styles.ChannelSeparatorActive);
  //     document.body.style.cursor = 'ns-resize';

  //     let lastTimeStamp = 0;

  //     // Assign mouse move listeners
  //     const onMouseMove = (_mouseMoveEvent: MouseEvent) => {
  //       requestAnimationFrame((timeStamp) => {
  //         // Only re-render every 10 ms
  //         if (!(timeStamp - lastTimeStamp > 10)) {
  //           return;
  //         }

  //         lastTimeStamp = timeStamp;
  //       });
  //     };

  //     const onMouseUp = () => {
  //       document.removeEventListener('mousemove', onMouseMove);
  //       document.removeEventListener('mouseup', onMouseUp);
  //       document.body.style.cursor = 'default';
  //       separator?.classList.remove(styles.ChannelSeparatorActive);
  //     };

  //     // document.addEventListener('mousemove', onMouseMove);
  //     // document.addEventListener('mouseup', onMouseUp);
  //   },
  //   [chartIndex],
  // );

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
                <span>Test</span>
              </button>
              {/* <ChannelActions chartIndex={chartIndex} /> */}
            </div>
          </div>
          <div
            title="Double click to reset all channel heights"
            id={`channel-separator-${chart.id}`}
            className={styles.ChannelLanesSeparatorButton}
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
