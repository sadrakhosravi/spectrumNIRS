import { getState, dispatch } from '@redux/store';
import { ChartType } from '@utils/constants';
import Chart from './Chart';
import ChartOptions from './ChartOptions';
// import { ChartChannels } from '@utils/channels';
// import { setPreviousData } from '@redux/ExperimentDataSlice';
import { setRecordChartPositions } from '@redux/RecordChartSlice';
import AccurateTimer from '@electron/helpers/accurateTimer';
import { AxisScrollStrategies } from '@arction/lcjs';

class RecordChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | any;
  drawingTimer: AccurateTimer | null;
  constructor(
    containerId: string,
    type: ChartType.RECORD | ChartType.REVIEW,
    channels = getState().sensorState.currentProbe?.device.defaultChannels || [
      'Ch1',
      'Ch2',
      'Ch3',
      'Ch4',
    ],
    samplingRate = getState().sensorState.currentProbe?.samplingRate || 100
  ) {
    super(channels, type, samplingRate, containerId);
    this.numberOfRows = this.channels.length;
    this.chartOptions = undefined;
    this.drawingTimer = null;
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

  listenForData() {
    const { ipcRenderer } = require('electron');

    let count = 0;

    const O2Hb = new Array(100);
    const HHb = new Array(100);
    const THb = new Array(100);
    const TOI = new Array(100);

    let time = 0;

    const handleData = (_event: any, _data: any) => {
      const data = _data;
      for (let i = 0; i < data.length; i++) {
        O2Hb[count] = { x: time * 10, y: data[i][0] };
        HHb[count] = { x: time * 10, y: data[i][1] };
        THb[count] = { x: time * 10, y: data[i][2] };
        TOI[count] = { x: time * 10, y: data[i][3] };
        count++;
        time++;

        if (count === 100) {
          this.series[0].add(O2Hb);
          this.series[1].add(HHb);
          this.series[2].add(THb);
          this.series[3].add(TOI);

          count = 0;
        }
      }

      return;
    };

    ipcRenderer.on('device:test', handleData);

    // Animate x axis scrolling manually.
    let xStepPerFrame =
      // New points count per 1 second
      (this.samplingRate * 10) /
      // 60 frames per second (axis is stepped every frame for smoothness)
      60;

    const axisX = this.xAxisChart.getDefaultAxisX();

    const stepAxisX = () => {
      const xCur = axisX.getInterval().end;
      const xMax = this.series[0].getXMax();
      const xNext = Math.min(xCur + xStepPerFrame, xMax);
      if (xNext !== xCur) {
        axisX.setInterval(xNext - 30 * 1000, xNext);
      }
      requestAnimationFrame(() => {
        stepAxisX();
        // addData();
      });
    };
    stepAxisX();
  }

  // drawData(data: any) {
  //   const DATA_LENGTH = data.length;
  //   const dataArr: any[] = [];
  //   const dataArr2: any[] = [];
  //   const dataArr3: any[] = [];
  //   const dataArr4: any[] = [];
  //   // Using for loop for fastest possible execution
  //   for (let i = 0; i < DATA_LENGTH; i++) {
  //     const O2Hb = {
  //       x: parseInt(data[i].timeStamp),
  //       y: parseFloat(data[i].O2Hb),
  //     };
  //     const HHb = {
  //       x: parseInt(data[i].timeStamp),
  //       y: parseFloat(data[i].HHb),
  //     };
  //     const THb = {
  //       x: parseInt(data[i].timeStamp),
  //       y: parseFloat(data[i].THb),
  //     };
  //     const TOI = {
  //       x: parseInt(data[i].timeStamp),
  //       y: parseFloat(data[i].TOI),
  //     };
  //     dataArr.push(O2Hb);
  //     dataArr2.push(HHb);
  //     dataArr3.push(THb);
  //     dataArr4.push(TOI);
  //   }

  //   requestAnimationFrame(() => {
  //     this.series && this.series[0].add(dataArr.splice(0, 10000));
  //     this.series && this.series[1].add(dataArr2.splice(0, 10000));
  //     this.series && this.series[2].add(dataArr3.splice(0, 10000));
  //     this.series && this.series[3].add(dataArr4.splice(0, 10000));
  //   });
  //   requestAnimationFrame(() => {
  //     this.charts?.forEach((chart) => chart.getDefaultAxisY().fit());
  //   });
  // }

  // loadLatestData = async () => {
  //   const data = await window.api.invokeIPC(
  //     ChartChannels.CheckForData,
  //     getState().experimentData.currentRecording.id
  //   );
  //   data.length > 1 && data.reverse();
  //   data.length > 1 && this.drawData(data);
  //   data.length > 1 &&
  //     dispatch(
  //       setPreviousData({
  //         timeStamp: data[data.length - 1].timeStamp,
  //         hasPreviousData: true,
  //       })
  //     );
  // };

  customizeRecordCharts() {
    this.dashboard.setAnimationsEnabled(false);
    this.charts &&
      this.charts.forEach((_chart, i) => {
        this.series && this.series[i].setDataCleaning({ minDataPointCount: 1 });
        // this.series[i].setDataCleaning({ minDataPointCount: 1});
        console.log(
          _chart
            .getDefaultAxisX()
            .setScrollStrategy(AxisScrollStrategies.progressive)
        );
      });
  }

  cleanup() {
    console.log('Destroy Chart');
    window.api.removeListeners('device:data');
    setImmediate(() => this.drawingTimer?.stop());
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
