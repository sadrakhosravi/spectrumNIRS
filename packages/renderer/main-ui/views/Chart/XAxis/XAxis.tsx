import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

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

const xAxisContainerId = 'x-axis-chart-container';

export const XAxis = observer(() => {
  let xAxisVM: XAxisChartViewModel = React.useMemo(() => new XAxisChartViewModel(), []);

  React.useEffect(() => {
    xAxisVM.init(xAxisContainerId, chartVM.charts[0].dashboardChart.chart);

    return () => {
      xAxisVM.dispose();
    };
  }, []);

  React.useEffect(() => {
    if (
      toJS(chartVM.parentContainerStyle?.overflowY) ||
      toJS(chartVM.parentContainerStyle?.overflow) === 'auto'
    ) {
      xAxisVM.setChartPaddingRight(15);
    } else {
      xAxisVM.setChartPaddingRight(0);
    }
  }, [chartVM.parentContainerStyle]);

  return (
    <>
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
    </>
  );
});
