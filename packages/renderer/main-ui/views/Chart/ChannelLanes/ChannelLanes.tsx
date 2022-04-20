import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './channelLanes.module.scss';

// Components
import { ChannelLaneItem } from './ChannelLaneItem';

// View model
import { vm } from '../ChartView';

export const ChannelLanes = observer(() => {
  return (
    <div className={styles.ChannelsContainer}>
      {vm.charts.map((chart, i) => (
        <ChannelLaneItem key={i} chart={chart} />
      ))}
    </div>
  );
});
