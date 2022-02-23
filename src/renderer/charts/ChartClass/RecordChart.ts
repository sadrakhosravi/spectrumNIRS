import { getState, dispatch } from '@redux/store';
import { ChartType } from '@utils/constants';
import Chart from './Chart';
import ChartOptions from './ChartOptions';
// import { ChartChannels } from '@utils/channels';
// import { setPreviousData } from '@redux/ExperimentDataSlice';
import { setRecordChartPositions, setTOIValue } from '@redux/RecordChartSlice';
import UIWorkerManager from 'renderer/UIWorkerManager';
const { ipcRenderer } = require('electron');

import TOINotification from '../../../sound/TOI_Notification.mp3';
import { ColorRGBA, SolidFill } from '@arction/lcjs';

class RecordChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | ChartOptions;
  stepXAxisFrame: number;
  seriesData: any[];
  TOI: number;
  count: number;
  TOINotification: HTMLAudioElement;
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

    this.TOINotification = new Audio(TOINotification);
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
    requestAnimationFrame(() => this.sendChartPositions());
  }

  loadInitialData = async () => {
    console.log('LOAD INITIAL DATA');
    const recordingId = getState().global.recording?.currentRecording?.id;
    if (!recordingId) return;

    const dbWorker = UIWorkerManager.getDatabaseWorker();
    const calcWorker = UIWorkerManager.getCalcWorker();
    const dbFilePath = await window.api.invokeIPC('get-database-path');

    dbWorker.postMessage({
      dbFilePath,
      recordingId,
      limit: 30 * this.samplingRate, // 30seconds
    });

    dbWorker.onmessage = (event) => {
      console.log(event.data);
      calcWorker.postMessage(event.data);
      UIWorkerManager.terminateDatabaseWorker();
    };

    calcWorker.onmessage = ({ data }) => {
      console.log(data);
      this.drawData(data);
      UIWorkerManager.terminateCalcWorker();
    };
  };

  drawData(data: number[][]) {
    const dataLength = data.length;
    const processedData: any[] = [[], [], [], [], []];
    for (let i = 0; i < dataLength; i += 1) {
      this.series.forEach((_series, j) => {
        processedData[j].push({ x: data[i][0], y: data[i][j + 1] });
      });
    }
    console.log(processedData);
    this.series.forEach((series, iSeries) =>
      series.add(processedData[iSeries])
    );
  }

  sendChartPositions = () => {
    // Send the initial chart position on creation
    const chartPos = this.getChartPositions(this.charts);
    dispatch(setRecordChartPositions(chartPos));

    // Listen for chart resize and send to the state
    // Using only one chart for reference event because it trigger
    // all the other charts in the dashboard
    this.charts[0].onResize(() => {
      requestAnimationFrame(() => {
        dispatch(setRecordChartPositions(this.getChartPositions(this.charts)));
      });
    });
  };

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

  handleDeviceData = async (_event: any, _data: number[][]) => {
    this.series.forEach(async (_series, i) => {
      const channelData = _data.map((dataPoint) => {
        return { x: dataPoint[0], y: dataPoint[i + 1] };
      });
      this.seriesData[i].push(...channelData);

      if (i === this.series.length - 1) {
        let TOI = 0;
        channelData.forEach(async (dataPoint) => (TOI += dataPoint.y));
        TOI = Math.round(TOI / channelData.length);
        if (TOI > 60) {
          this.TOINotification.play();
          this.charts[3].setSeriesBackgroundFillStyle(
            new SolidFill({ color: ColorRGBA(60, 0, 0) })
          );
        } else {
          this.charts[3].setSeriesBackgroundFillStyle(
            new SolidFill({ color: ColorRGBA(0, 0, 0) })
          );
        }
        dispatch(setTOIValue(TOI));
      }
    });
  };

  stopListeningForData() {
    this.TOINotification.pause();
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
    cancelAnimationFrame(this.stepXAxisFrame);
    this.clearData();
    this.memoryCleanup();
    this.chartOptions?.memoryCleanup();
    //@ts-ignore
    this.chartOptions = undefined;
    UIWorkerManager.terminateDatabaseWorker();
    console.log('End Cleaning');
  }

  // Clears the series and custom ticks
  clearData() {
    this.clearCharts();
    this.chartOptions?.clearCharts();
  }
}

export default RecordChart;
