import { ChartType } from '@utils/constants';
import Chart from './Chart';
import {
  AutoCursorModes,
  Axis,
  AxisScrollStrategies,
  AxisTickStrategies,
  Band,
  ChartXY,
  ColorHEX,
  ColorRGBA,
  Dashboard,
  emptyFill,
  // emptyFill,
  LineSeries,
  PointMarker,
  SolidFill,
  SolidLine,
  UIBackground,
} from '@arction/lcjs';
import ChartOptions from './ChartOptions';
import WorkerManager from 'workers/WorkerManager';
import { getState, dispatch } from '@redux/store';
import { setIsLoadingData } from '@redux/AppStateSlice';

import { ChartChannels } from '@utils/channels';
import { setAllEvents } from '@redux/ChartSlice';
import AccurateTimer from '@electron/helpers/accurateTimer';
import { Token } from '@arction/eventer';

class ReviewChart extends Chart {
  numberOfRows: number;
  dashboard: null | Dashboard;
  charts: null | ChartXY<PointMarker, UIBackground>[];
  series: null | LineSeries[];
  chartOptions: null | ChartOptions;
  isLoadingData: boolean;
  zoomBandChart: undefined | ChartXY<PointMarker, UIBackground>;
  zoomBandChartSeries: undefined | LineSeries[];
  zoomBandBand: undefined | Band;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    super(channels, type, samplingRate, containerId);
    this.numberOfRows = this.channels.length + 1;
    this.dashboard = null;
    this.charts = null;
    this.series = null;
    this.chartOptions = null;
    this.zoomBandChart = undefined;
    this.zoomBandChartSeries = undefined;
    this.zoomBandBand = undefined;
    this.isLoadingData = false;
  }

  /**
   * Creates the review chart and all its options/customizations
   */
  createReviewChart() {
    this.dashboard = this.createDashboard(this.numberOfRows, this.containerId);
    this.charts = this.createChartPerChannel(this.channels, this.dashboard);
    this.series = this.createSeriesForEachChart(this.charts);
    this.synchronizeXAxis(this.charts);
    this.customizeChart(this.charts);
    this.uiList(this.charts, this.dashboard);
    this.customCursor(this.dashboard, this.charts, this.series);
    this.chartOptions = new ChartOptions(
      this.channels,
      this.dashboard,
      this.charts,
      this.series,
      true
    );
    this.customizeCharts();
    this.createZoomBandChart();
    this.listenForKeyPress();
    this.customizeXAxis();
    this.synchronizeXAxis(this.charts);
    this.customizeZoomBandChart();
    this.loadAllEvents();
    this.syncAxisXandZoomBandChart();
  }

  /**
   * Gets the current recording data from the controller.
   * @returns - If no data found.
   */
  loadData = async () => {
    dispatch(setIsLoadingData(true));
    const recordingId = getState().experimentData?.currentRecording?.id;
    if (!recordingId) return;
    await window.api.sendIPC(ChartChannels.StreamData, recordingId);

    window.api.onIPCData(ChartChannels.StreamData, (_event, data) => {
      console.log(data);
      this.drawDataOnCharts(data);
    });
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

    console.timeEnd('calc1');
    const drawTimer = new AccurateTimer(() => {
      requestAnimationFrame(() => {
        this.series && this.series[0].add(dataArr.slice(0, 10000));
        this.series && this.series[1].add(dataArr2.slice(0, 10000));
        this.series && this.series[2].add(dataArr3.slice(0, 10000));
        this.series && this.series[3].add(dataArr4.slice(0, 10000));

        requestAnimationFrame(() => {
          this.zoomBandChartSeries &&
            this.zoomBandChartSeries[0].add(dataArr.splice(0, 10000));
          this.zoomBandChartSeries &&
            this.zoomBandChartSeries[1].add(dataArr2.splice(0, 10000));
          this.zoomBandChartSeries &&
            this.zoomBandChartSeries[2].add(dataArr3.splice(0, 10000));
          this.zoomBandChartSeries &&
            this.zoomBandChartSeries[3].add(dataArr4.splice(0, 10000));
        });

        if (dataArr.length === 0) {
          drawTimer.stop();
          dispatch(setIsLoadingData(false));
          this.isLoadingData = false;
        }
      });
    }, 50);
    drawTimer.start();
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
      eventsWorker.onmessage = ({ data }) => {
        dispatch(setAllEvents(data));
        console.log(data);
        eventsWorker.terminate();
        return;
      };
    }

    dispatch(setAllEvents([]));
  };

  /**
   * Creates the ZoomBandChart and its series.
   */
  createZoomBandChart() {
    this.zoomBandChart = this.dashboard?.createChartXY({
      rowIndex: this.numberOfRows,
      columnIndex: 1,
    });

    this.zoomBandChartSeries = this.series?.map((_, i) => {
      return (this.zoomBandChart as ChartXY<PointMarker, UIBackground>)
        .addLineSeries({
          dataPattern: {
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
            // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
            regularProgressiveStep: false,
          },
        })
        .setDataCleaning(undefined)
        .setStrokeStyle(
          new SolidLine({
            thickness: 1.25,
            fillStyle: new SolidFill({
              color: ColorHEX(this.seriesLineColorArr[i]),
            }),
          })
        );
    });
  }

  /**
   * Customizes the styles and functionality of ZoomBandChart.
   */
  customizeZoomBandChart() {
    const zoomBandChart = this.zoomBandChart as ChartXY<
      PointMarker,
      UIBackground
    >;
    const [axisX, axisY] = zoomBandChart.getDefaultAxes();

    // Customize Y Axis
    axisY.setTickStrategy(AxisTickStrategies.Empty);
    axisY.setScrollStrategy(AxisScrollStrategies.fitting);
    axisY.setThickness(65);
    axisY.setMouseInteractions(false);

    // Customize X Axis
    axisX.setTickStrategy(AxisTickStrategies.Empty);
    axisX.setScrollStrategy(AxisScrollStrategies.fitting);

    // Customize Chart
    zoomBandChart.setTitleFillStyle(emptyFill);
    zoomBandChart.setAutoCursorMode(AutoCursorModes.disabled);
    zoomBandChart.setMouseInteractionRectangleFit(false);
    zoomBandChart.setMouseInteractionsWhileScrolling(false);
    zoomBandChart.setMouseInteractionRectangleZoom(false);
    zoomBandChart.setMouseInteractionPan(false);

    // Customize Band
    const band = axisX.addBand();
    this.zoomBandBand = band;

    band.setFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255, 25) }));
    band.setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(255, 255, 255, 45) }),
      })
    );

    let bandValueStart = 0;
    let bandValueEnd = 30000;

    band.setValueStart(bandValueStart);
    band.setValueEnd(bandValueEnd);

    let valueChangeToken: Token;

    // Add listener on mouse enter to prevent an infinite loop because of
    // The same listener on the axisXChart

    band.onMouseEnter(() => {
      valueChangeToken = band.onValueChange((_, start, end) => {
        this.xAxisChart?.getDefaultAxisX().setInterval(start, end, false, true);
        bandValueStart = start;
        bandValueEnd = end;
      });
    });

    // Cleanup listener on mouse leave
    band.onMouseLeave(() => {
      band.offValueChange(valueChangeToken);
    });

    // Add jump to a point on click
    zoomBandChart.onSeriesBackgroundMouseClick(() => {
      const { location } = zoomBandChart.solveNearest() as any;
      const bandValueMiddle = (bandValueEnd - bandValueStart) / 2;
      band.setValueStart(location.x - bandValueMiddle);
      band.setValueEnd(location.x + bandValueMiddle);
      this.xAxisChart
        ?.getDefaultAxisX()
        .setInterval(location.x - 30000, location.x + 30000, false, true);
    });
  }

  /**
   * Synchronizes the channel intervals with the ZoomBandChart
   */
  syncAxisXandZoomBandChart() {
    const axisX = this.axisX as Axis;
    const band = this.zoomBandBand as Band;

    let scaleChangeToken: Token;

    // Add listener on mouse enter to prevent an infinite loop because of
    // The same listener on the ZommBandBand.
    axisX.onAxisInteractionAreaMouseEnter(() => {
      scaleChangeToken = axisX.onScaleChange((start, end) => {
        requestAnimationFrame(() => {
          band.setValueStart(start);
          band.setValueEnd(end);
        });
      });
    });

    // Cleanup listener on mouse leave
    axisX.onAxisInteractionAreaMouseLeave(() => {
      axisX.offScaleChange(scaleChangeToken);
    });
  }

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
    console.log('Destroy Chart');
    this.chartOptions = null;
    this.dashboard?.dispose();
    this.charts = null;
    this.series = null;
    window.removeEventListener('keydown', this.handleKeyPress);
    window.api.removeListeners(ChartChannels.StreamData);
    dispatch(setAllEvents([]));
    dispatch(setIsLoadingData(false));
  }

  /**
   * Clears the chart and all its custom ticks and options
   */
  clearCharts() {
    this.series?.forEach((series: any) => {
      series.clear();
    });
    this.charts?.forEach((chart: any) => {
      chart.getDefaultAxisX().setInterval(0, 30000);
    });
    this.chartOptions?.clearCharts();

    this.charts?.forEach((chart) => {
      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();

      axisX.setInterval(
        0,
        (this.chartOptions as ChartOptions).getTimeDivision()
      );
      axisY.setInterval(0, 10);
    });
  }
}

export default ReviewChart;
