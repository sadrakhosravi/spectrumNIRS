import * as React from 'react';

// Styles
import * as styles from '../channelLanes.module.scss';

type ChannelSeriesType = {
  settingsToggle?: React.MouseEventHandler<HTMLButtonElement>;
  channelRef: React.LegacyRef<HTMLButtonElement>;
  name: string;
  color?: string;
};

export const ChannelSeries = ({ settingsToggle, channelRef, name, color }: ChannelSeriesType) => {
  return (
    <button className={styles.ChannelInfo} onClick={settingsToggle} ref={channelRef}>
      <span style={{ backgroundColor: color }} />
      <span>{name || 'No Name'}</span>
    </button>
  );
};
