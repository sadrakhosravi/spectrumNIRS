import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

// Styles
import * as styles from './chart.module.scss';

// Components
import { ChannelLanes } from './ChannelLanes/ChannelLanes';
import { XAxis } from './XAxis/XAxis';
import { SensorInfo } from './SensorInfo/SensorInfo';

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
    chartVM.addChart();

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
          <XAxis />
          <SensorInfo />
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
