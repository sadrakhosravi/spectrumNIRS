import * as React from 'react';

// Styles
import * as styles from './channelItem.module.scss';

// View Models

export const ChannelAxisScaleIndicator = () => {
  return (
    <div className={styles.ChannelAxisIndicator}>
      <span className={styles.ChannelAxisIndicatorYAxis}>50</span>
      <span className={styles.ChannelAxisIndicatorXAxis}>50</span>
    </div>
  );
};
