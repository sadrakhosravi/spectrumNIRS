import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './channelLanes.module.scss';

// Icons
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const iconSettings = {
  size: 16,
  color: '#ccc',
};

type ChannelActionsType = {
  chartIndex: number;
};

export const ChannelActions = observer(({ chartIndex }: ChannelActionsType) => {
  const [isMaximized, setIsMaximized] = React.useState(false);
  console.log(chartIndex);
  // Handles channel maximize button
  const handleMaximizeClick = React.useCallback(() => {
    // const dashboard = ChartModel.chartInstance?.getDashboard() as Dashboard;

    // for (let i = 0; i < ChartModel.charts.length; i++) {
    //   if (i === chartIndex) {
    //     continue;
    //   }
    //   dashboard.setRowHeight(i, isMaximized ? 1 : 0.0001);
    // }
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
        {!isMaximized ? (
          <FiMaximize2 {...iconSettings} title={'Maximize Channel'} />
        ) : (
          <FiMinimize2 {...iconSettings} title={'Minimize Channel'} />
        )}
      </button>
    </div>
  );
});
