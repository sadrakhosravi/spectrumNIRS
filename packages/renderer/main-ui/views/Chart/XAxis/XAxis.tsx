import * as React from 'react';

// Styles
import * as styles from './xAxis.module.scss';

// Components
import { Listbox } from '/@/components/Elements/Listbox';
import { IconOnlyButton } from '/@/components/Elements/Buttons';

// Icons
import { FiLock } from 'react-icons/fi';

// View Models
import { chartVM } from '@store';
import { XAxisChartViewModel } from '@viewmodels/index';
import { observer } from 'mobx-react-lite';

const xAxisContainerId = 'x-axis-chart-container';

export const XAxis = observer(() => {
  let xAxisVM: XAxisChartViewModel = React.useMemo(() => new XAxisChartViewModel(), []);

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
        <IconOnlyButton
          icon={<FiLock size="16px" />}
          isActive={xAxisVM.isLocked}
          onClick={xAxisVM.toggleAxisLock}
          tooltipText={xAxisVM.isLocked ? 'Restore Axis Scrolling' : 'Stop Axis Scrolling'}
        />
      </div>
      <div id={xAxisContainerId} className={styles.XAxisRight}></div>
    </div>
  );
});
