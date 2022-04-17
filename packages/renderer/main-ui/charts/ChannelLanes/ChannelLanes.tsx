import * as React from 'react';
import { observer } from 'mobx-react-lite';
import ChartModel from '@models/ChartModel';

// Styles
import * as styles from './channelLanes.module.scss';

// Components
import { ChannelLaneItem } from './ChannelLaneItem';

export const ChannelLanes = observer(() => {
  return (
    <div className={styles.Channel}>
      {ChartModel.charts.map((_chart, i) => (
        <ChannelLaneItem chartIndex={i} />
      ))}
    </div>
  );
});
