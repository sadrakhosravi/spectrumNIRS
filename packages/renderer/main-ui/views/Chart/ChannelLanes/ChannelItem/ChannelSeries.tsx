import * as React from 'react';

// Styles
import * as styles from '../channelLanes.module.scss';

type ChannelSeriesType = {
  settingsToggle?: React.MouseEventHandler<HTMLButtonElement>;
  channelRef: React.LegacyRef<HTMLButtonElement>;
  name: string;
};

export const ChannelSeries = ({ settingsToggle, channelRef, name }: ChannelSeriesType) => {
  return (
    <button className={styles.ChannelInfo} onClick={settingsToggle} ref={channelRef}>
      <span />
      <span>{name || 'No Series Name'}</span>
    </button>
  );
};
