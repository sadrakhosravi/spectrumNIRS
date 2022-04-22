import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './channelLanes.module.scss';

// Components
import { ChannelLaneItem } from './ChannelItem';
import { ChartCursors } from './ChartCursors';

// View model
import { vm } from '../ChartView'; // Prevents unnecessary re-renders

export const ChannelLanes = observer(() => {
  return (
    <div className={styles.ChannelsContainer}>
      {vm.charts.map((chart, i) => (
        <ChannelLaneItem key={i + chart.id} chart={chart} chartIndex={i} />
      ))}
      {/* When mouse is over this area, charts will show cursors at that point */}
      <ChartCursors />
    </div>
  );
});
