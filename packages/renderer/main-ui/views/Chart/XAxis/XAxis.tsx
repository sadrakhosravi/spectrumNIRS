import * as React from 'react';

// Styles
import * as styles from './xAxis.module.scss';

// View Models
import { vm as chartVM } from '../ChartView';
import { XAxisChartViewModel } from '@viewmodels/index';
import { observer } from 'mobx-react-lite';

let xAxisVM = new XAxisChartViewModel();

export const XAxis = observer(() => {
  React.useEffect(() => {
    xAxisVM.init('tick-container', chartVM.charts[0].dashboardChart.chart);
  }, []);

  return (
    <div className={styles.XAxisContainer}>
      <div className={styles.XAxisLeft}>Test</div>
      <div id={'tick-container'} className={styles.XAxisRight}></div>
    </div>
  );
});
