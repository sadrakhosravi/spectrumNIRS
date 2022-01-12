import { ChartType } from '@utils/constants';

import Chart from './Chart';
import {
  AxisScrollStrategies,
  Band,
  ChartXY,
  emptyFill,
  // emptyFill,
  LineSeries,
  PointMarker,
  UIBackground,
} from '@arction/lcjs';

// Methods
import zoomBandChart from './methods/ZoomBandChart';

import ChartOptions from './ChartOptions';
import WorkerManager from 'workers/WorkerManager';
import { getState, dispatch } from '@redux/store';
import { setIsLoadingData } from '@redux/AppStateSlice';
import { ChartChannels } from '@utils/channels';
import { setAllEvents } from '@redux/ChartSlice';
import { setReviewChartPositions } from '@redux/ReviewChartSlice';

class ReviewChart extends Chart {
  numberOfRows: number;
  chartOptions: undefined | ChartOptions;
  isLoadingData: boolean;
  zoomBandChart: undefined | ChartXY<PointMarker, UIBackground>;
  zoomBandChartSeries!: LineSeries[];
  zoomBandBand: undefined | Band;
  allData: any[];
  drawAnimationFrameId: undefined | number;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    super(channels, type, samplingRate, containerId);
    this.numberOfRows = this.channels.length + 1;
    this.chartOptions = undefined;
    this.zoomBandChart = undefined;
    this.zoomBandBand = undefined;
    this.isLoadingData = false;
    this.allData = [];
    this.drawAnimationFrameId = undefined;
  }

  /**
   * Creates the review chart and all its options/customizations
   */
  createReviewChart() {
    this.createDashboard(this.numberOfRows, this.containerId);
    this.synchronizeXAxis(this.charts);
    this.chartOptions = new ChartOptions(
      this.channels,
      this.dashboard,
      this.charts,
      this.series,
      true
    );
    this.customizeCharts();
    this.zoomBandChart = zoomBandChart.bind(this)();
    this.listenForKeyPress();
    this.synchronizeXAxis(this.charts);
    // setTimeout(() => {
    //   this.loadAllEvents();
    // }, 1000);
    this.sendChartPositions();
  }

  sendChartPositions() {
    // Send the initial chart position on creation
    requestAnimationFrame(() => {
      dispatch(setReviewChartPositions(this.getChartPositions()));
    });

    // Listen for chart resize and send to the state
    // Using only one chart for reference event because it trigger
    // all the other charts in the dashboard
    this.charts[0].onResize(() => {
      requestAnimationFrame(() => {
        dispatch(setReviewChartPositions(this.getChartPositions()));
      });
    });
  }

  /**
   * Gets the current recording data from the controller.
   * @returns - If no data found.
   */
  loadData = async () => {
    const databasePath = await window.api.invokeIPC('get-database-path');
    const databaseWorker = WorkerManager.startDatabaseWorker();
    const buffMemLength = new SharedArrayBuffer(1024 * 480);

    databaseWorker.postMessage({ dbPath: databasePath, arr: buffMemLength });

    databaseWorker.onmessage = ({ data }) => {
      console.timeEnd('threadStart');
      this.drawAnimationFrameId = requestAnimationFrame(() => {
        this.series.forEach((series) => series.addArrayY(data, 10, 0));
      });
    };

    dispatch(setIsLoadingData(true));
    console.log('LOAD DATA');
    const recordingId = getState().experimentData?.currentRecording?.id;

    if (recordingId === -1 || !recordingId) {
      dispatch(dispatch(setIsLoadingData(false)));
      return;
    }
    // window.api.sendIPC(ChartChannels.StreamData, recordingId);
    // window.api.onIPCData(ChartChannels.StreamData, (_event, data: number[]) => {
    //   console.log(data);
    //   if (data.length === 0) {
    //     dispatch(dispatch(setIsLoadingData(false)));
    //     console.log(this.allData);
    //   }
    //   this.allData.push(data);
    //   this.drawDataOnCharts(data);
    // });
  };

  /**
   * Sorts the data array and sends it to the `LCJS` for the chart
   * engine to draw.
   * @param data - Array of data
   */
  drawDataOnCharts = (data: any) => {
    const DATA_LENGTH = data.length;
    const dataArr: any[] = [];
    const dataArr2: any[] = [];
    const dataArr3: any[] = [];
    const dataArr4: any[] = [];
    console.time('calc1');

    // Using for loop for fastest possible execution
    for (let i = 0; i < DATA_LENGTH; i++) {
      const O2Hb = {
        x: parseInt(data[i].x),
        y: parseFloat(data[i].O2Hb),
      };
      const HHb = {
        x: parseInt(data[i].x),
        y: parseFloat(data[i].HHb),
      };
      const THb = {
        x: parseInt(data[i].x),
        y: parseFloat(data[i].THb),
      };
      const TOI = {
        x: parseInt(data[i].x),
        y: parseFloat(data[i].TOI),
      };
      dataArr.push(O2Hb);
      dataArr2.push(HHb);
      dataArr3.push(THb);
      dataArr4.push(TOI);
    }

    console.timeEnd('calc1');
    requestAnimationFrame(() => {
      console.time('appendTimer');
      this.series[0].add(dataArr);
      this.series[1].add(dataArr2);
      this.series[2].add(dataArr3);
      this.series[3].add(dataArr4);
      this.zoomBandChartSeries[0].add(dataArr);
      this.zoomBandChartSeries[1].add(dataArr2);
      this.zoomBandChartSeries[2].add(dataArr3);
      this.zoomBandChartSeries[3].add(dataArr4);

      dataArr.length = 0;
      dataArr2.length = 0;
      dataArr3.length = 0;
      dataArr4.length = 0;
      console.timeEnd('appendTimer');
    });

    data.length = 0;
    dispatch(setIsLoadingData(false));
    this.isLoadingData = false;
  };

  /**
   * Listens for keydown event
   */
  listenForKeyPress() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  /**
   * Filters the left and right arrow key from the keypress listener
   * and changes the interval accordingly.
   * @param event - Keyboard event
   */
  handleKeyPress = async (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && this.charts) {
      const timeDivision = this.chartOptions?.timeDivision as number;

      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start + timeDivision,
        end: currentInterval.end + timeDivision,
      };
      this.setInterval(newInterval.start, newInterval.end);
    }

    if (event.key === 'ArrowLeft' && this.charts) {
      const timeDivision = this.chartOptions?.timeDivision as number;
      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start - timeDivision,
        end: currentInterval.end - timeDivision,
      };
      this.setInterval(newInterval.start, newInterval.end);
    }
  };

  /**
   * Sets the current interval of the chart.
   * @param start - Start of the interval in milliseconds
   * @param end - End of the interval in milliseconds. If not supplied the current `TimeDivision` will be the applied
   */
  setInterval(start: number, end?: number) {
    const timeDivision = this.chartOptions?.getTimeDivision() as number;
    if (this.charts) {
      this.charts[0]
        .getDefaultAxisX()
        .setInterval(start, end || start + timeDivision, 0, true);
    }
  }

  /**
   * Gets all events from the controller, sends it to the events worker
   * and sets the sorted events in the redux store.
   */
  loadAllEvents = async () => {
    const events = await window.api.invokeIPC(
      ChartChannels.GetAllEvents,
      getState().experimentData.currentRecording.id
    );

    // If any events found, send them to the worker to
    // return a sorted list with the start and end of each event
    if (events.length > 0) {
      const eventsWorker = WorkerManager.startEventsWorker();
      eventsWorker.postMessage(events);
      // eventsWorker.onmessage = ({ data }) => {
      //   dispatch(setAllEvents(data));
      //   console.log(data);
      //   eventsWorker.terminate();
      //   return;
      // };
      eventsWorker.terminate();
    }

    dispatch(setAllEvents([]));
  };

  /**
   * Customizes the style and functionality of all channels
   */
  customizeCharts() {
    this.dashboard?.setAnimationsEnabled(false);
    this.charts?.forEach((chart, i) => {
      // Disable rectangle zoom
      // chart.setMouseInteractionRectangleZoom(false);
      // // Disable right click drag
      // // chart.setMouseInteractionPan(false);
      // // Disable rectangle fit
      // chart.setMouseInteractionRectangleFit(false);
      // Disable mouse interaction on x axis and zoom on wheel

      // Automatic Data Cleaning

      this.series && this.series[i].setDataCleaning({ minDataPointCount: 0 });

      chart
        .getDefaultAxisX()
        .setInterval(0, 30 * 1000)
        .setScrollStrategy(AxisScrollStrategies.regressive)
        .setMouseInteractions(false)
        .setChartInteractionZoomByWheel(false)
        .setTitleFillStyle(emptyFill);

      chart.getDefaultAxisY().setScrollStrategy(AxisScrollStrategies.fitting);
    });
  }

  /**
   * Cleanup of the chart to free up resources
   */
  cleanup() {
    window.removeEventListener('keydown', this.handleKeyPress);
    console.log(this.drawAnimationFrameId);
    this.drawAnimationFrameId &&
      window.cancelAnimationFrame(this.drawAnimationFrameId);
    window.api.removeListeners(ChartChannels.StreamData);

    dispatch(setAllEvents([]));
    dispatch(setIsLoadingData(false));
    this.zoomBandChartSeries.forEach((series) => {
      series.clear();
      series.dispose();
    });

    console.log('Destroy Chart');
    this.memoryCleanup();
    this.chartOptions?.memoryCleanup();
    //@ts-ignore
    this.chartOptions = undefined;
    //@ts-ignore
    this.zoomBandChartSeries = undefined;
    this.zoomBandBand = undefined;
  }

  /**
   * Clears the chart and all its custom ticks and options
   */
  clearCharts() {
    this.series?.forEach((series) => series.clear());
    this.zoomBandChartSeries?.forEach((series) => series.clear());
    this.chartOptions?.clearCharts();

    this.xAxisChart.getDefaultAxisX()?.setInterval(0, 30000, false, true);
    this.zoomBandChart?.getDefaultAxisX().setInterval(0, 30000, false, true);
    this.zoomBandBand?.setValueStart(0);
    this.zoomBandBand?.setValueEnd(30000);

    this.charts?.forEach((chart) => {
      const axisY = chart.getDefaultAxisY();
      axisY.setInterval(-50, 50);
    });
  }
}

export default ReviewChart;
