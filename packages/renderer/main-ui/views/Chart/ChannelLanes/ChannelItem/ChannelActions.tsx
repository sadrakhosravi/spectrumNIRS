import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from '../channelLanes.module.scss';

// Icons
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';

// Types
import type { DashboardChart } from '@models/Chart';

// View Model
import { vm } from '../../ChartView';

const iconSettings = {
  size: 16,
  color: '#ccc',
};

type ChannelActionsType = {
  chart: DashboardChart;
};

export const ChannelActions = observer(({ chart }: ChannelActionsType) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  // Handles channel maximize button
  const handleMaximizeClick = React.useCallback(() => {
    isMaximized ? vm.resetChannelHeights() : vm.maximizeChannel(chart.id);
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
