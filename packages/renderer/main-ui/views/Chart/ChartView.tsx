import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './chart.module.scss';

// Components
import { ChannelLanes } from './ChannelLanes/ChannelLanes';

// View model
import { ChartViewModel } from '@viewmodels/index';
import { toJS } from 'mobx';
export let vm = new ChartViewModel();

export const ChartView = observer(() => {
  const id = 'main-chart-container';

  React.useEffect(() => {
    if (!vm) {
      vm = new ChartViewModel();
    }
    // Initialize the dashboard
    vm.init(id);

    setTimeout(() => {
      vm.addSeries(vm.charts[0].id, 'Test');
    }, 3000);

    return () => {
      vm.dispose();

      //@ts-ignore
      vm = null;
    };
  }, []);

  return (
    <div className={styles.ChartContainer} style={toJS(vm.parentContainerStyle)}>
      <div className={styles.Chart} id={id} style={toJS(vm.chartContainerStyle)}>
        <ChannelLanes />
      </div>
    </div>
  );
});
