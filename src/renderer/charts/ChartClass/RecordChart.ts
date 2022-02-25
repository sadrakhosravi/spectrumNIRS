import { getState, dispatch } from '@redux/store';
import { ChartType } from '@utils/constants';
import Chart from './Chart';
import ChartOptions from './ChartOptions';
// import { ChartChannels } from '@utils/channels';
// import { setPreviousData } from '@redux/ExperimentDataSlice';
import { setRecordChartPositions, setTOIValue } from '@redux/RecordChartSlice';
import UIWorkerManager from 'renderer/UIWorkerManager';
const { ipcRenderer } = require('electron');

import {
  ColorHEX,
  ColorRGBA,
  LUT,
  PalettedFill,
  SolidFill,
} from '@arction/lcjs';
import { setIsAppLoading } from '@redux/AppStateSlice';

class RecordChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | ChartOptions;
  stepXAxisFrame: number;
  seriesData: any[];
  TOI: number;
  count: number;
  minTOIVal: number | undefined;
  maxTOIVal: number | undefined;
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

    this.seriesData = [[], [], [], []];
    this.TOI = 0;
    this.count = 0;

    //threshold
    this.minTOIVal =
      getState().global.recording?.currentRecording?.settings.TOIThreshold?.minimum;

    this.maxTOIVal =
      getState().global.recording?.currentRecording?.settings.TOIThreshold?.maximum;

    dispatch(setIsAppLoading(true));
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
      this.series,
      false,
      this.xAxisChart
    );
    requestAnimationFrame(() => {
      this.sendChartPositions();
      this.charts[0]
        .getDefaultAxisX()
        .setInterval(0, this.chartOptions?.getTimeDivision() || 30 * 1000)
        .release();
    });
  }

  loadInitialData = async () => {
    const recordingId = getState().global.recording?.currentRecording?.id;

    if (!recordingId) {
      dispatch(setIsAppLoading(false));
      return;
    }

    const dbWorker = UIWorkerManager.getDatabaseWorker();
    const calcWorker = UIWorkerManager.getCalcWorker();
    const dbFilePath = await window.api.invokeIPC('get-database-path');

    dbWorker.postMessage({
      dbFilePath,
      recordingId,
      limit: 30 * this.samplingRate, // 30seconds
    });

    dbWorker.onmessage = (event) => {
      if (!event.data || event.data.length === 0) {
        UIWorkerManager.terminateCalcWorker();
        UIWorkerManager.terminateDatabaseWorker();
        dispatch(setIsAppLoading(false));

        return;
      }
      calcWorker.postMessage(event.data);
      UIWorkerManager.terminateDatabaseWorker();
    };

    calcWorker.onmessage = ({ data }) => {
      this.drawData(data);
      dispatch(setIsAppLoading(false));

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
    requestAnimationFrame(() => {
      this.handleDeviceData2();
    });
  }

  handleDeviceData2() {
    let tPrev = performance.now();
    let newDataModulus = 0;
    const streamMoreData = () => {
      const tNow = performance.now();
      const tDelta = tNow - tPrev;
      let newDataPointsCount =
        this.samplingRate * (tDelta / 1000) + newDataModulus;
      newDataModulus = newDataPointsCount % 1;
      newDataPointsCount = Math.floor(newDataPointsCount);

      const seriesNewDataPoints: any[] = [];
      for (let iChannel = 0; iChannel < this.series.length; iChannel++) {
        const nDataset = this.seriesData[iChannel % this.seriesData.length];
        const newDataPoints = [];
        for (let iDp = 0; iDp < newDataPointsCount; iDp++) {
          const point = nDataset[iDp];
          if (point) newDataPoints.push(point);
        }
        seriesNewDataPoints[iChannel] = newDataPoints;
      }

      this.series.forEach((nSeries, iSeries) =>
        nSeries.add(seriesNewDataPoints[iSeries])
      );
      this.seriesData.forEach((data) => data.splice(0, newDataPointsCount));

      // Request next frame.
      tPrev = tNow;
      this.stepXAxisFrame = requestAnimationFrame(streamMoreData);
    };
    streamMoreData();
  }

  handleDeviceDataWithThreshold = async (_event: any, _data: number[][]) => {
    this.series.forEach(async (_series, i) => {
      const channelData = _data.map((dataPoint) => {
        return { x: dataPoint[0], y: dataPoint[i + 1] };
      });
      this.seriesData[i].push(...channelData);

      if (i === this.series.length - 1) {
        let TOI = 0;
        channelData.forEach(async (dataPoint) => (TOI += dataPoint.y));
        TOI = Math.round(TOI / channelData.length);
        if (
          TOI > (this.maxTOIVal as number) ||
          TOI < (this.minTOIVal as number)
        ) {
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

  handleDeviceData = async (_event: any, _data: number[][]) => {
    this.series.forEach(async (_series, i) => {
      const channelData = _data.map((dataPoint) => {
        return { x: dataPoint[0], y: dataPoint[i + 1] };
      });
      this.seriesData[i].push(...channelData);
    });
  };

  stopListeningForData() {
    ipcRenderer.removeAllListeners('device:data');
    cancelAnimationFrame(this.stepXAxisFrame);
    setImmediate(() => cancelAnimationFrame(this.stepXAxisFrame));
    dispatch(setTOIValue(undefined));
  }

  customizeRecordCharts() {
    this.dashboard.setAnimationsEnabled(false);
    this.charts &&
      this.charts.forEach((chart, i) => {
        this.series &&
          this.series[i].setDataCleaning({
            minDataPointCount: 60 * this.samplingRate,
          });
        chart
          .setMouseInteractionPan(false)
          .setMouseInteractionRectangleFit(false)
          .setMouseInteractionWheelZoom(false)
          .setMouseInteractionRectangleZoom(false);
        // this.series[i].setDataCleaning({ minDataPointCount: 1});
      });

    const TOISeries = this.series.filter(
      (series) => series.getName() === 'TOI'
    )[0];

    // Colors
    const ColorRed = ColorHEX('#FF0000');
    const ColorWhite = ColorHEX('#FFF');
    if (this.minTOIVal && this.maxTOIVal) {
      const yPalette = new PalettedFill({
        lookUpProperty: 'y',
        lut: new LUT({
          interpolate: false,
          steps: [
            { value: 0, color: ColorRed },
            { value: this.minTOIVal, color: ColorWhite },
            { value: this.maxTOIVal, color: ColorRed },
          ],
        }),
      });

      TOISeries.setStrokeStyle((stroke) => stroke.setFillStyle(yPalette));
    }

    this.xAxisChart
      .getDefaultAxisX()
      .onAxisInteractionAreaMouseDoubleClick(() => {
        this.charts[0].getDefaultAxisX().release();
      });
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
