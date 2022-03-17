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
  SolidLine,
} from '@arction/lcjs';
import { setIsAppLoading } from '@redux/AppStateSlice';
import SeriesToggle from './methods/SeriesToggles';
import EventManager, {
  IEvents,
} from '@electron/models/DeviceReader/EventManager';
import { setAllEvents } from '@redux/ChartSlice';

class RecordChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | ChartOptions;
  stepXAxisFrame: number;
  seriesData: any[];
  TOI: number;
  count: number;
  minTOIVal: number | undefined;
  maxTOIVal: number | undefined;
  dummySeries: any[];
  dummySeriesData: any[];
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

    this.dummySeries = [];
    this.dummySeriesData = [[], [], [], []];

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
    const currentRecording = getState().global.recording;

    if (!recordingId || currentRecording?.lastTimeStamp === 0) {
      dispatch(setIsAppLoading(false));
      return;
    }

    const dbWorker = UIWorkerManager.getDatabaseWorker();
    const calcWorker = UIWorkerManager.getCalcWorker();
    const dbFilePath = await window.api.invokeIPC('get-database-path');
    const msgChannel = new MessageChannel();
    const eventMsgChannel = new MessageChannel();

    dbWorker.postMessage(
      {
        dbFilePath,
        currentRecording: currentRecording?.currentRecording,
        limit: 30 * this.samplingRate,
        port: msgChannel.port1,
        eventPort: eventMsgChannel.port2,
      },
      { transfer: [msgChannel.port1, eventMsgChannel.port2] }
    );

    calcWorker.postMessage(
      {
        port: msgChannel.port2,
        currentRecording: currentRecording?.currentRecording,
      },
      { transfer: [msgChannel.port2] }
    );
    msgChannel.port1.start();
    msgChannel.port2.start();
    eventMsgChannel.port1.start();
    eventMsgChannel.port2.start();

    dbWorker.onmessage = ({ data }) => {
      if (!data || data === 'end') {
        UIWorkerManager.terminateCalcWorker();
        UIWorkerManager.terminateDatabaseWorker();
        dispatch(setIsAppLoading(false));
        msgChannel.port1.close();
        msgChannel.port2.close();

        return;
      }
    };

    calcWorker.onmessage = ({ data }) => {
      this.drawData(data);
      dispatch(setIsAppLoading(false));
    };

    eventMsgChannel.port1.onmessage = ({ data }) => {
      const events = EventManager.parseEvents(data);
      this.addEvents(events);
      eventMsgChannel.port1.close();
      eventMsgChannel.port2.close();
    };
  };

  stopChartLoading() {
    dispatch(setIsAppLoading(false));
  }

  drawFilteredData(data: any) {
    const filteredSeries = this.charts[0]
      .addLineSeries({
        dataPattern: {
          allowDataGrouping: true,
          // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
          pattern: 'ProgressiveX',
          // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
          regularProgressiveStep: true,
        },
      })
      .setStrokeStyle(
        new SolidLine({
          thickness: 1.25,
          fillStyle: new SolidFill({
            color: ColorHEX('#CCC'),
          }),
        })
      );
    filteredSeries.add(data);
  }

  addEvents = (events: IEvents[]) => {
    dispatch(setAllEvents(events));
    for (let i = 0; i < events.length; i += 1) {
      this.chartOptions?.drawMarker(
        events[i].timeSequence as number,
        events[i].name,
        '#CCC'
      );
    }
  };

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
    this.seriesToggles = SeriesToggle.bind(this)();

    // ipcRenderer.on('device:calcData', this.handleDummyData.bind(this));
    this.stepXAxisFrame = requestAnimationFrame(() => {
      this.handleDeviceData2();
    });

    // this.handleDummyDataFiltered();
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

      const dummySeriesDataPoints: any[] = [];
      for (let iChannel = 0; iChannel < this.dummySeries.length; iChannel++) {
        const nDataset =
          this.dummySeriesData[iChannel % this.dummySeriesData.length];
        const newDataPoints = [];
        for (let iDp = 0; iDp < newDataPointsCount; iDp++) {
          const point = nDataset[iDp];
          if (point) newDataPoints.push(point);
        }
        dummySeriesDataPoints[iChannel] = newDataPoints;
      }

      this.series.forEach((nSeries, iSeries) =>
        nSeries.add(seriesNewDataPoints[iSeries])
      );
      this.dummySeries.forEach((nSeries, iSeries) =>
        nSeries.add(dummySeriesDataPoints[iSeries])
      );
      this.seriesData.forEach((data) => data.splice(0, newDataPointsCount));
      this.dummySeriesData.forEach((data) =>
        data.splice(0, newDataPointsCount)
      );

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

  handleDummyData = (_event: any, _data: any) => {
    this.series.forEach((series) => series.add(_data));
  };

  handleDummyDataFiltered = () => {
    this.dummySeries = this.charts.map((chart, i) =>
      chart
        .addLineSeries({
          dataPattern: {
            allowDataGrouping: true,
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
            // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
            regularProgressiveStep: true,
          },
        })
        .setName(this.channels[i] + ' Unfiltered')
        .setStrokeStyle(
          new SolidLine({
            thickness: 1.25,
            fillStyle: new SolidFill({
              color: ColorHEX('#CCC'),
            }),
          })
        )
    );

    ipcRenderer.on('device:calcData', (_event, _data) => {
      this.dummySeries.forEach(async (_series, i) => {
        const channelData = _data.map((dataPoint: any) => {
          return { x: dataPoint[0], y: dataPoint[i + 1] };
        });
        this.dummySeriesData[i].push(...channelData);
      });
    });
  };

  stopListeningForData() {
    ipcRenderer.removeListener('device:data', this.handleDeviceData);
    ipcRenderer.removeAllListeners('device:data');
    ipcRenderer.removeAllListeners('device:calcData');
    this.dummySeries.forEach((series) => series.dispose());
    this.dummySeries.length = 0;
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
