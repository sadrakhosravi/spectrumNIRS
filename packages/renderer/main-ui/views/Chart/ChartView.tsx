import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

// Styles
import * as styles from './chart.module.scss';

// Components
import { ChannelLanes } from './ChannelLanes/ChannelLanes';
import { XAxis } from './XAxis/XAxis';
import { SensorInfo } from './SensorInfo/SensorInfo';

// Icons
import { FiInfo } from 'react-icons/fi';

// View models
import {
  chartVM,
  initChartVM,
  disposeChartVM,
  barChartVM,
  initBarChartVM,
  disposeBarChartVM,
} from '@store';

export const ChartView = observer(() => {
  const id = 'main-chart-container';
  const barChartId = 'bar-chart-container';
  React.useMemo(() => initChartVM(), []);

  React.useLayoutEffect(() => {
    if (!chartVM) initChartVM();
    chartVM.init(id);

    return () => {
      console.log('Chart Cleanup');
      disposeChartVM();
    };
  }, []);

  // On chart bart view, load the bar view chart
  React.useEffect(() => {
    if (chartVM.currentView === 'bar') {
      initBarChartVM();
      barChartVM?.init(barChartId);
    }

    return () => {
      disposeBarChartVM();
    };
  }, [chartVM.currentView]);

  return (
    <>
      <div className={styles.ChartContainer}>
        {chartVM.currentView === 'bar' && <div className={styles.ChartBarView} id={barChartId} />}
        <span style={{ visibility: chartVM.currentView === 'line' ? 'visible' : 'hidden' }}>
          <div className={styles.XAxisContainer}>
            {chartVM.charts.length > 0 && (
              <>
                <XAxis />
              </>
            )}
          </div>

          {chartVM.charts.length > 0 && (
            <>
              <SensorInfo />
            </>
          )}
          {chartVM.charts.length === 0 && (
            <div className={styles.EmptyChartMessage}>
              <span>
                <FiInfo size="66px" strokeWidth={1.7} />
                <p>Please add a device to start.</p>
              </span>
            </div>
          )}
        </span>
        <div
          className={styles.ChartAreaContainer}
          style={toJS(chartVM?.parentContainerStyle) || undefined}
        >
          <ChannelLanes />
          <div className="w-full h-full relative">
            <div
              className={styles.Chart}
              id={id}
              style={toJS(chartVM?.chartContainerStyle) || undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
});
