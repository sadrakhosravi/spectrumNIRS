import { getState, dispatch } from '@redux/store';
import { ChartType } from '@utils/constants';
import Chart from './Chart';
import ChartOptions from './ChartOptions';
// import { ChartChannels } from '@utils/channels';
// import { setPreviousData } from '@redux/ExperimentDataSlice';
import { setRecordChartPositions, setTOIValue } from '@redux/RecordChartSlice';
import { ExperimentChannels } from '@utils/channels';
const { ipcRenderer } = require('electron');

class RecordChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | ChartOptions;
  stepXAxisFrame: number;
  seriesData: any[];
  TOI: number;
  count: number;
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
    this.stepXAxisFrame = 0;
    console.log(getState().sensorState.currentProbe?.samplingRate);

    this.seriesData = [[], [], [], []];
    this.TOI = 0;
    this.count = 0;

    requestAnimationFrame(this.getCurrentRecordingData);
  }

  getCurrentRecordingData = async () => {
    console.log(
      await window.api.invokeIPC(ExperimentChannels.GetCurrentRecordingData)
    );
  };

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
    ipcRenderer.on('device:data', this.handleDeviceData);
    console.log('LISTENING FOR DATA');
    const axisX = this.xAxisChart.getDefaultAxisX();

    const addData = () => {
      this.series.forEach((series, i) => {
        series.add(this.seriesData[i].splice(0, this.seriesData[i].length - 1));
      });
    };

    let xStepPerFrame =
      // New points count per 1 second
      (this.samplingRate * 10) /
      // 60 frames per second (axis is stepped every frame for smoothness)
      60;

    axisX.setInterval(axisX.getInterval().start, axisX.getInterval().end);

    const stepAxisX = () => {
      const xCur = axisX.getInterval().end;
      const xMax = this.series[0].getXMax();
      const xNext = Math.min(xCur + xStepPerFrame, xMax);
      if (xNext !== xCur) {
        axisX.setInterval(
          xNext - (this.chartOptions?.getTimeDivision() as number),
          xNext
        );
      }
      addData();
      this.stepXAxisFrame = requestAnimationFrame(stepAxisX);
    };

    setTimeout(() => {
      addData();
      axisX.setInterval(
        this.series[0].getXMax() -
          (this.chartOptions?.getTimeDivision() as number),
        this.series[0].getXMax()
      );

      // stepAxisX();
      requestAnimationFrame(stepAxisX);
    }, 150);
  }

  handleDeviceData = (_event: any, _data: number[][]) => {
    this.series.forEach((_series, i) => {
      const channelData = _data.map((dataPoint) => {
        return { x: dataPoint[0], y: dataPoint[i + 1] };
      });
      this.seriesData[i].push(...channelData);

      if (i === this.series.length - 1) {
        let TOI = 0;
        channelData.forEach((dataPoint) => (TOI += dataPoint.y));
        TOI = Math.round(TOI / channelData.length);
        dispatch(setTOIValue(TOI));
      }
    });
  };

  stopListeningForData() {
    const { ipcRenderer } = require('electron');
    ipcRenderer.removeAllListeners('device:data');
    cancelAnimationFrame(this.stepXAxisFrame);
    setImmediate(() => cancelAnimationFrame(this.stepXAxisFrame));
    dispatch(setTOIValue(undefined));
    // this.series.forEach((series) => series.clear());
  }

  customizeRecordCharts() {
    this.dashboard.setAnimationsEnabled(false);
    this.charts &&
      this.charts.forEach((chart, i) => {
        this.series && this.series[i].setDataCleaning({ minDataPointCount: 1 });
        chart
          .setMouseInteractionPan(false)
          .setMouseInteractionRectangleFit(false)
          .setMouseInteractionWheelZoom(false)
          .setMouseInteractionRectangleZoom(false);
        // this.series[i].setDataCleaning({ minDataPointCount: 1});
      });

    this.xAxisChart.setMouseInteractions(false);
    this.xAxisChart.getDefaultAxisX().setMouseInteractions(false);
  }

  cleanup() {
    console.log('Destroy Chart');
    window.api.removeListeners('device:data');
    setImmediate(() => cancelAnimationFrame(this.stepXAxisFrame));
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
