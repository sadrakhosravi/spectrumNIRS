import * as React from 'react';

// Styles
import * as styles from './xAxis.module.scss';

// View Models
import { vm } from '../ChartView';
import { ChartsXAxisViewModel } from '@viewmodels/index';
import { observer } from 'mobx-react-lite';

let xAxisVM = new ChartsXAxisViewModel();

export const XAxis = React.memo(
  observer(() => {
    React.useEffect(() => {
      xAxisVM.attachToChart(
        vm.charts[0],
        document.getElementById('tick-container') as HTMLDivElement,
      );
    }, []);

    return (
      <div className={styles.XAxisContainer}>
        <div className={styles.XAxisLeft}>Test</div>
        <div id={'tick-container'} className={styles.XAxisRight}>
          {xAxisVM.ticks.map((tick, i) => (
            <div key={'tick-items' + i} className={styles.TickItem} style={{ left: tick.x }}>
              {tick.text}
            </div>
          ))}
        </div>
      </div>
    );
  }),
);
