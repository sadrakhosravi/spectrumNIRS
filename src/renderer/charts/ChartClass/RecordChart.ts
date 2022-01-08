import { ChartType } from '@utils/constants';
import Chart from './Chart';
import ChartOptions from './ChartOptions';
import { ChartChannels } from '@utils/channels';
import { getState, dispatch } from '@redux/store';
import { setPreviousData } from '@redux/ExperimentDataSlice';

class RecordChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | ChartOptions;
  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    super(channels, type, samplingRate, containerId);
    this.numberOfRows = this.channels.length;
    this.chartOptions = undefined;
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
  }

  listenForData() {
    type Data = {
      x: number;
      y: number;
    };
    let count = 0;
    let O2Hb: Data[] = [];
    let HHb: Data[] = [];
    let THb: Data[] = [];
    let TOI: Data[] = [];

    window.api.onIPCData('data:reader-record', (_event, data) => {
      // Change TOI value every 15 samples (based on 100samples/s)
      if (count === 5) {
        this.TOILegend.setText(Math.round(data[data.length - 1][4]).toString());
        count = 0;
      }

      for (let i = 0; i < data.length; i += 1) {
        O2Hb.push({ x: data[i][0], y: data[i][1] });
        HHb.push({ x: data[i][0], y: data[i][2] });
        THb.push({ x: data[i][0], y: data[i][3] });
        TOI.push({ x: data[i][0], y: data[i][4] });
      }

      requestAnimationFrame(() => {
        this.series[0].add(O2Hb.splice(0, O2Hb.length - 1));
        this.series[1].add(HHb.splice(0, HHb.length - 1));
        this.series[2].add(THb.splice(0, THb.length - 1));
        this.series[3].add(TOI.splice(0, TOI.length - 1));
      });
    });
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
      this.charts.forEach((chart, i) => {
        const axisX = chart.getDefaultAxisX();
        console.log(axisX);

        this.series && this.series[i].setDataCleaning({ minDataPointCount: 1 });
      });
  }

  cleanup() {
    console.log('Destroy Chart');
    window.api.removeListeners('data:reader-record');
    this.memoryCleanup();
    this.chartOptions = undefined;
  }

  // Clears the series and custom ticks
  clearData() {
    this.clearCharts();
    this.chartOptions?.clearCharts();
  }
}

export default RecordChart;
