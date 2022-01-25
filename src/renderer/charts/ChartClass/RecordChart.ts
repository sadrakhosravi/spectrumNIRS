import { getState, dispatch } from '@redux/store';
import { ChartType } from '@utils/constants';
import Chart from './Chart';
import ChartOptions from './ChartOptions';
import { ChartChannels } from '@utils/channels';
import { setPreviousData } from '@redux/ExperimentDataSlice';
import { setRecordChartPositions } from '@redux/RecordChartSlice';
// import WorkerManager from 'workers/WorkerManager';

class RecordChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | ChartOptions;
  constructor(
    containerId: string,
    type: ChartType.RECORD | ChartType.REVIEW,
    channels = getState().sensorState.currentProbe?.device.defaultChannels || [
      'No Channels',
    ],
    samplingRate = getState().sensorState.currentProbe?.samplingRate || 100
  ) {
    super(channels, type, samplingRate, containerId);
    this.numberOfRows = this.channels.length;
    this.chartOptions = undefined;

    console.log(getState().sensorState.currentProbe?.samplingRate);

    console.log('RECOORDDD CHARTTT');
  }

  // Creates the record chart
  createRecordChart() {
    this.createDashboard(this.numberOfRows, this.containerId);
    this.synchronizeXAxis(this.charts);
    this.customizeRecordCharts();
    this.chartOptions = new ChartOptions(
      this.channels,
      this.dashboard,
      this.charts,
      this.series
    );
    this.sendChartPositions();
  }

  sendChartPositions() {
    // Send the initial chart position on creation
    requestAnimationFrame(() => {
      console.log(this.getChartPositions());
      dispatch(setRecordChartPositions(this.getChartPositions()));
    });

    // Listen for chart resize and send to the state
    // Using only one chart for reference event because it trigger
    // all the other charts in the dashboard
    this.charts[0].onResize(() => {
      requestAnimationFrame(() => {
        dispatch(setRecordChartPositions(this.getChartPositions()));
      });
    });
  }

  handleIncomingData = (
    _event: Electron.IpcRendererEvent,
    data: number[][]
  ) => {
    data.forEach((data) => {
      this.series.forEach((series) => series.addArrayY([data[2]], 10));
    });
  };

  listenForData() {
    window.api.onIPCData('device:data', this.handleIncomingData);
  }

  drawData(data: any) {
    const DATA_LENGTH = data.length;
    const dataArr: any[] = [];
    const dataArr2: any[] = [];
    const dataArr3: any[] = [];
    const dataArr4: any[] = [];
    // Using for loop for fastest possible execution
    for (let i = 0; i < DATA_LENGTH; i++) {
      const O2Hb = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].O2Hb),
      };
      const HHb = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].HHb),
      };
      const THb = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].THb),
      };
      const TOI = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].TOI),
      };
      dataArr.push(O2Hb);
      dataArr2.push(HHb);
      dataArr3.push(THb);
      dataArr4.push(TOI);
    }

    requestAnimationFrame(() => {
      this.series && this.series[0].add(dataArr.splice(0, 10000));
      this.series && this.series[1].add(dataArr2.splice(0, 10000));
      this.series && this.series[2].add(dataArr3.splice(0, 10000));
      this.series && this.series[3].add(dataArr4.splice(0, 10000));
    });
    requestAnimationFrame(() => {
      this.charts?.forEach((chart) => chart.getDefaultAxisY().fit());
    });
  }

  loadLatestData = async () => {
    const data = await window.api.invokeIPC(
      ChartChannels.CheckForData,
      getState().experimentData.currentRecording.id
    );
    data.length > 1 && data.reverse();
    data.length > 1 && this.drawData(data);
    data.length > 1 &&
      dispatch(
        setPreviousData({
          timeStamp: data[data.length - 1].timeStamp,
          hasPreviousData: true,
        })
      );
  };

  customizeRecordCharts() {
    this.charts &&
      this.charts.forEach((_chart, i) => {
        this.series && this.series[i].setDataCleaning({ minDataPointCount: 1 });
      });
  }

  cleanup() {
    console.log('Destroy Chart');
    window.api.removeListeners('device:data');
    this.clearData();
    this.memoryCleanup();
    this.chartOptions?.memoryCleanup();
    //@ts-ignore
    this.chartOptions = undefined;
  }

  // Clears the series and custom ticks
  clearData() {
    this.clearCharts();
    this.chartOptions?.clearCharts();
  }
}

export default RecordChart;
