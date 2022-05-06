import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

// Styles
import * as styles from './chart.module.scss';

// Components
import { ChannelLanes } from './ChannelLanes/ChannelLanes';
import { XAxis } from './XAxis/XAxis';

// Types

// View models
import { chartVM, initChartVM, disposeChartVM } from '@store';

import { deviceManagerVM } from '@store';
import { SensorInfo } from './SensorInfo/SensorInfo';

export const ChartView = observer(() => {
  const id = 'main-chart-container';
  React.useMemo(() => initChartVM(), []);

  React.useLayoutEffect(() => {
    if (!chartVM) initChartVM();
    chartVM.init(id);

    return () => {
      console.log('Chart Cleanup');
      disposeChartVM();
    };
  }, []);

  // Update charts based on the number of active channels
  React.useEffect(() => {
    // The dashboard will always have 1 chart, create 1 less than the total channels
    // Adjust charts
    const lengthDiff = deviceManagerVM.activeDevices[0].activeLEDs - chartVM.charts.length;

    // Remove charts
    if (lengthDiff < 0) {
      for (let i = 0; i < Math.abs(lengthDiff); i++) {
        chartVM.removeLastChart();
      }
    }

    if (lengthDiff > 0) {
      for (let i = 0; i < lengthDiff; i++) {
        const chart = chartVM.addChart();

        chartVM.addSeries(chart.getId(), `Channel ${chart.getChartRowIndex() + 1}`);
      }
    }
  }, [deviceManagerVM.activeDevices[0].activeLEDs]);

  return (
    <div className={styles.ChartContainer}>
      <XAxis />
      <SensorInfo />
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
  );
});
