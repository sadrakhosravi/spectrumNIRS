import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from '../channelLanes.module.scss';

// Icons
import { FiMaximize2, FiMinimize2, FiFilter } from 'react-icons/fi';

// Types
import type { DashboardChart } from '@models/Chart';

// View Model
import { chartVM } from '@store';
import Tippy from '@tippyjs/react';

const iconSettings = {
  size: 16,
  color: '#ccc',
};

type ChannelActionsType = {
  chart: DashboardChart;
  chartIndex: number;
};

export const ChannelActions = observer(({ chart, chartIndex }: ChannelActionsType) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  // Handles channel maximize button
  const handleMaximizeClick = React.useCallback(() => {
    isMaximized ? chartVM.resetChannelHeights() : chartVM.maximizeChannel(chart.id);
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
      {chartVM.charts[chartIndex].series.length !== 0 &&
        chartVM.charts[chartIndex].series[0].lpFilter && (
          <Tippy content="Lowpass Filter Active">
            <button
              className={`${styles.ChannelActionButton} ${styles.ChannelActionButtonDisabled} `}
            >
              <FiFilter {...iconSettings} />
            </button>
          </Tippy>
        )}
    </div>
  );
});
