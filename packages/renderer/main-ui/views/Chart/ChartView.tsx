import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

// Styles
import * as styles from './chart.module.scss';

// Components
import { ChannelLanes } from './ChannelLanes/ChannelLanes';
import { XAxis } from './XAxis/XAxis';

// View model
import { ChartViewModel } from '@viewmodels/index';
import { probeSettingVM } from '/@/widgets/CalibrationWidgets/ProbeSettingsWidget/';
import { ipcRenderer } from 'electron/renderer';
import { ReaderChannels } from '@utils/channels/ReaderChannels';

// import { XAxis } from './XAxis/XAxis';
export let vm = new ChartViewModel();

export const ChartView = observer(() => {
  const id = 'main-chart-container';
  React.useLayoutEffect(() => {
    // Initialize the dashboard
    vm.init(id);

    return () => {
      vm.dispose();

      //@ts-ignore
      vm = null;
    };
  }, []);

  React.useEffect(() => {
    ipcRenderer.on(ReaderChannels.DEVICE_DATA, (_data) => {});

    return () => {
      ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_DATA);
    };
  }, [vm.charts.length]);

  // Update charts based on the number of active channels
  React.useEffect(() => {
    // The dashboard will always have 1 chart, create 1 less than the total channels
    // Adjust charts
    const lengthDiff = probeSettingVM.activePDs - vm.charts.length;

    // Remove charts
    if (lengthDiff < 0) {
      for (let i = 0; i < Math.abs(lengthDiff); i++) {
        vm.removeLastChart();
      }
    }

    if (lengthDiff > 0) {
      for (let i = 0; i < lengthDiff; i++) {
        const chart = vm.addChart();

        vm.addSeries(chart.getId(), `Channel ${chart.getChartRowIndex() + 1}`);
      }
    }
  }, [probeSettingVM.activePDs]);

  return (
    <div className={styles.ChartContainer}>
      <XAxis />
      <div className={styles.ChartAreaContainer}>
        <ChannelLanes />
        <div className="w-full h-full relative" style={toJS(vm.parentContainerStyle)}>
          <div className={styles.Chart} id={id} style={toJS(vm.chartContainerStyle)}></div>
        </div>
      </div>
    </div>
  );
});
