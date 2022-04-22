import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './chart.module.scss';

// Components
import { ChannelLanes } from './ChannelLanes/ChannelLanes';

// View model
import { ChartViewModel } from '@viewmodels/index';
import { toJS } from 'mobx';
// import { XAxis } from './XAxis/XAxis';
export let vm = new ChartViewModel();

export const ChartView = observer(() => {
  const id = 'main-chart-container';
  React.useLayoutEffect(() => {
    if (!vm) {
      vm = new ChartViewModel();
    }
    // Initialize the dashboard
    vm.init(id);

    vm.charts.forEach((chart, i) => {
      chart.series.push(chart.dashboardChart.addLineSeries(`Series ${i}`)),
        chart.series[0].generateDummyData();
    });

    return () => {
      vm.dispose();

      //@ts-ignore
      vm = null;
    };
  }, []);

  return (
    <div className={styles.ChartContainer}>
      <div className={styles.ChartAreaContainer}>
        <div className="h-full w-full" style={toJS(vm.parentContainerStyle)}>
          <div className={styles.Chart} id={id} style={toJS(vm.chartContainerStyle)}>
            <ChannelLanes />
          </div>
        </div>
      </div>
    </div>
  );
});
