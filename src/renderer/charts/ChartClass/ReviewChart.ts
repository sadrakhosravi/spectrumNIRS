import { ChartType } from '@utils/constants';
import Chart from './Chart';
import {
  AxisScrollStrategies,
  AxisTickStrategies,
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
  ZoomBandChart,
} from '@arction/lcjs';
import ChartOptions from './ChartOptions';
import WorkerManager from 'workers/WorkerManager';
import { getState, dispatch } from '@redux/store';
import { setIsLoadingData } from '@redux/AppStateSlice';

import { ChartChannels } from '@utils/channels';
import { setAllEvents } from '@redux/ChartSlice';

class ReviewChart extends Chart {
  numberOfRows: number;
  dashboard: null | Dashboard;
  charts: null | ChartXY<PointMarker, UIBackground>[];
  series: null | LineSeries[];
  chartOptions: null | ChartOptions;
  zoomBandChart: undefined | ZoomBandChart;
  XMax: number;
  XMin: number;
  DATA_LOADING_THRESHOLD: number;
  endOfData: boolean;
  isLoadingData: boolean;
  NUM_OF_POINTS_TO_QUERY: number;
  PREVIOUS_DATA_LOADING_THRESHOLD: number;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4'],
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
    this.XMax = 3000;
    this.XMin = 0;
    this.NUM_OF_POINTS_TO_QUERY = 300000;
    this.DATA_LOADING_THRESHOLD = 60 * 1000;
    this.PREVIOUS_DATA_LOADING_THRESHOLD = 3 * 1000;
    this.endOfData = false;
    this.isLoadingData = false;
  }

  // Creates the record chart
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
    this.listenForRightArrowKey();
    this.synchronizeXAxis(this.charts);
    this.customizeZoomBandChart();
    this.loadAllEvents();
  }

  loadInitialData = async () => {
    dispatch(setIsLoadingData(true));
    const recordingId = getState().experimentData?.currentRecording?.id;
    if (!recordingId) return;
    await window.api.sendIPC(ChartChannels.StreamData, recordingId);

    window.api.onIPCData(ChartChannels.StreamData, (_event, data) => {
      this.drawDataOnCharts(data);
    });
  };

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

    this.series && this.series[0].add(dataArr.splice(0, 10000));
    this.series && this.series[1].add(dataArr2.splice(0, 10000));
    this.series && this.series[2].add(dataArr3.splice(0, 10000));
    this.series && this.series[3].add(dataArr4.splice(0, 10000));

    requestAnimationFrame(() => {
      this.charts?.forEach((chart) => chart.getDefaultAxisY().fit());
    });

    if (dataArr.length === 0) {
      this.XMin = (this.series && this.series[0].getXMin()) as number;
      this.XMax = (this.series && this.series[0].getXMax()) as number;
      dispatch(setIsLoadingData(false));
      this.isLoadingData = false;
      return;
    }
  };

  listenForRightArrowKey() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

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

  setInterval(start: number, end?: number) {
    const timeDivision = this.chartOptions?.getTimeDivision() as number;
    if (this.charts) {
      this.charts[0]
        .getDefaultAxisX()
        .setInterval(start, end || start + timeDivision, 0, true);
    }
  }

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

  createZoomBandChart() {
    this.zoomBandChart = this.dashboard
      ?.createZoomBandChart({
        rowIndex: this.channels.length,
        columnIndex: 1,
        columnSpan: 1,
        axis: (this.charts as any).map((chart: any) => chart.getDefaultAxisX()),
      })
      .setTitleFillStyle(emptyFill)
      .setPadding(0);
  }

  customizeZoomBandChart() {
    this.zoomBandChart?.band.setValueStart(0);
    this.zoomBandChart?.band.setValueEnd(30000);
    this.zoomBandChart?.band.setFillStyle(
      new SolidFill({ color: ColorRGBA(255, 255, 255, 50) })
    );
    this.zoomBandChart?.band.setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(255, 255, 255, 150) }),
      })
    );
    this.zoomBandChart
      ?.getDefaultAxisX()
      .setTickStrategy(AxisTickStrategies.Empty);

    let count = 0;
    this.zoomBandChart?.setSeriesStyle((series) => {
      //@ts-ignore
      series.setStrokeStyle(
        new SolidLine({
          thickness: 0.5,
          fillStyle: new SolidFill({
            color: ColorHEX(this.seriesLineColorArr[count]),
          }),
        })
      );
      count++;
    });
  }

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

      this.dashboard?.setRowHeight(i, 1);

      chart
        .getDefaultAxisX()
        .setInterval(0, 30 * 1000)
        .setScrollStrategy(AxisScrollStrategies.regressive)
        .setMouseInteractions(false)
        .setChartInteractionZoomByWheel(false)
        .setTitleFillStyle(emptyFill);

      chart.getDefaultAxisY().setScrollStrategy(AxisScrollStrategies.fitting);
    });
    this.dashboard?.setRowHeight(4, 0.5);
  }

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

  // Clears the series and custom ticks
  clearCharts() {
    this.series?.forEach((series: any) => {
      series.clear();
    });
    this.charts?.forEach((chart: any) => {
      chart.getDefaultAxisX().setInterval(0, 30000);
    });
    this.chartOptions?.clearCharts();
  }
}

export default ReviewChart;
