import * as React from 'react';

// Styles
import * as styles from './xAxis.module.scss';

// Components
import { Listbox } from '/@/components/Elements/Listbox';

// View Models
import { chartVM } from '@store';
import { XAxisChartViewModel } from '@viewmodels/index';
import { observer } from 'mobx-react-lite';

let xAxisVM = new XAxisChartViewModel();
const xAxisContainerId = 'x-axis-chart-container';

export const XAxis = observer(() => {
  React.useEffect(() => {
    xAxisVM.init(xAxisContainerId, chartVM.charts[0].dashboardChart.chart);

    return () => {
      xAxisVM.cleanup();
    };
  }, []);

  return (
    <div className={styles.XAxisContainer}>
      <div className={styles.XAxisLeft}>
        <span>Time Div</span>
        <Listbox options={xAxisVM.divisions} value={xAxisVM.timeDiv} setter={xAxisVM.setTimeDiv} />
      </div>
      <div id={xAxisContainerId} className={styles.XAxisRight}></div>
    </div>
  );
});
