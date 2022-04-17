import * as React from 'react';
import ChartModel from '@models/ChartModel';

// Styles
import * as styles from './channelLanes.module.scss';

// Icons
import { FiMaximize2 } from 'react-icons/fi';

// Types
import type { Dashboard } from '@arction/lcjs';

const iconSettings = {
  size: 16,
  color: '#ccc',
};

type ChannelActionsType = {
  chartIndex: number;
};

export const ChannelActions = ({ chartIndex }: ChannelActionsType) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  // Handles channel maximize button
  const handleMaximizeClick = React.useCallback(() => {
    const dashboard = ChartModel.chartInstance?.getDashboard() as Dashboard;

    for (let i = 0; i < ChartModel.charts.length; i++) {
      if (i === chartIndex) {
        continue;
      }
      dashboard.setRowHeight(i, isMaximized ? 1 : 0);
    }
    setIsMaximized(!isMaximized);
  }, [isMaximized]);

  return (
    <div className={styles.ChannelActionContainer}>
      <button
        className={`${styles.ChannelActionButton} ${
          isMaximized && styles.ChannelActionButtonActive
        }`}
        onClick={handleMaximizeClick}
      >
        <FiMaximize2 {...iconSettings} title={'Maximize Channel'} />
      </button>
    </div>
  );
};
