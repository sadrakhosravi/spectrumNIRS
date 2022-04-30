import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from '../channelLanes.module.scss';

// Components
import { ChannelSeries } from './ChannelSeries';
import { ChannelSettings } from './ChannelSettings';
import { ChannelActions } from './ChannelActions';
// import { GainButton } from './GainButton';

// Types
import type { IChart } from '@viewmodels/Chart/ChartViewModel';

// View model
import { vm } from '../../ChartView';

type ChannelLaneItemType = {
  chart: IChart;
  chartIndex: number;
};

export const ChannelLaneItem = observer(({ chart, chartIndex }: ChannelLaneItemType) => {
  const [top, setTop] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);
  //@ts-ignore
  const [isCompact, setIsCompact] = React.useState(false);

  const channelInfoRef = React.useRef<HTMLButtonElement>(null);

  console.log('Channel Item');

  React.useEffect(() => {
    const size = chart.dashboardChart.getSize();

    // Resize channels on chart resize
    const token = chart.dashboardChart.chart.onResize(() => {
      requestAnimationFrame(() => {
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

        setTop(size.y1);
        setHeight(size.height);
      });
    });

    setTop(size.y1);
    setHeight(size.height);

    return () => {
      chart?.dashboardChart?.chart?.offResize(token);
    };
  }, [chart]);

  // Handles the on channel name click
  const handleOpenChannelSettings = () => {
    setIsSettingsOpen(false); // FIXME: Fix the channel open button
  };

  return (
    <>
      {!isMaximized && (
        <div className={styles.ChannelLaneItem} style={{ top, height }}>
          <div className={styles.ChannelUI}>
            <div className={styles.ChannelUIInnerContainer}>
              {vm.charts[chartIndex].series.map((series, i) => (
                <ChannelSeries
                  key={i + series.series.getName()}
                  name={series.series.getName()}
                  channelRef={channelInfoRef}
                  settingsToggle={handleOpenChannelSettings}
                />
              ))}
              {vm.charts[chartIndex].series.length === 0 && 'No Series'}
              {/* <GainButton /> */}
              <ChannelActions chart={chart.dashboardChart} />
            </div>
          </div>
          <div
            id={`channel-separator-${chart.id}`}
            className={styles.ChannelLanesSeparatorButton}
          />
        </div>
      )}

      {isSettingsOpen && (
        <ChannelSettings
          parentRef={channelInfoRef.current as HTMLButtonElement}
          closeSetter={setIsSettingsOpen}
          channelInfo={chart.channel}
        />
      )}
    </>
  );
});
