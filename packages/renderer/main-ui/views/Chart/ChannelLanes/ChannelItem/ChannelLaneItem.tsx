import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from '../channelLanes.module.scss';

// Components
import { ChannelSeries } from './ChannelSeries';
import { ChannelSettings } from './ChannelSettings';
import { ChannelActions } from './ChannelActions';
// import { ChannelAxisScaleIndicator } from './ChannelAxisScaleIndicator';
// import { GainButton } from './GainButton';
import { SeriesUnit } from './SeriesUnit';

// Types
import type { IChart } from '@viewmodels/Chart/ChartViewModel';
import type { Token } from '@arction/eventer';

// View model
import { chartVM } from '@store';

type ChannelLaneItemType = {
  chart: IChart;
  chartIndex: number;
};

export const ChannelLaneItem = observer(({ chart, chartIndex }: ChannelLaneItemType) => {
  const [top, setTop] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const channelInfoRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    let token: Token;
    requestAnimationFrame(() => {
      const size = chart.dashboardChart.getSize();

      // Resize channels on chart resize
      token = chart.dashboardChart.chart.onResize(() => {
        requestAnimationFrame(() => {
          const size = chart.dashboardChart.getSize();
          if (size.height < 15) {
            setIsMaximized(true);
          }

          if (size.height > 15) {
            setIsMaximized(false);
          }

          if (size.height < 55) {
          }

          setTop(size.y1);
          setHeight(size.height);
        });
      });

      setTop(size.y1);
      setHeight(size.height);
    });

    return () => {
      chart?.dashboardChart?.chart?.offResize(token);
    };
  }, []);

  // Handles the on channel name click
  const handleOpenChannelSettings = React.useCallback(() => {
    setIsSettingsOpen(!isSettingsOpen);
  }, []);

  return (
    <>
      {!isMaximized && (
        <div className={styles.ChannelLaneItem} style={{ top, height }}>
          <div className={styles.ChannelUI}>
            <div className={styles.ChannelUIInnerContainer}>
              {/* Series Button Info */}
              {chartVM.charts[chartIndex].series.map((series, i) => (
                <ChannelSeries
                  key={i + series.series.getName()}
                  name={series.series.getName()}
                  color={series.color}
                  channelRef={channelInfoRef}
                  settingsToggle={handleOpenChannelSettings}
                />
              ))}
              {chartVM.charts[chartIndex].series.length === 0 && <p></p>}

              {/* <GainButton /> */}
              {/* Channel Action Buttons */}
              <ChannelActions chart={chart.dashboardChart} chartIndex={chartIndex} />
            </div>

            {/* Series Unit */}
            <SeriesUnit />
          </div>

          <div
            id={`channel-separator-${chart.id}`}
            className={styles.ChannelLanesSeparatorButton}
          />

          {/* <ChannelAxisScaleIndicator /> */}
        </div>
      )}

      {/* Channel Settings */}
      {isSettingsOpen && (
        <ChannelSettings
          parentRef={channelInfoRef.current as HTMLButtonElement}
          closeSetter={setIsSettingsOpen}
          chart={chart}
        />
      )}
    </>
  );
});
