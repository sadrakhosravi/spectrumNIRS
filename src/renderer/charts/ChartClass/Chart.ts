// Import LCJS
import {
  synchronizeAxisIntervals,
  translatePoint,
  Dashboard,
  ChartXY,
  PointMarker,
  UIBackground,
  LineSeries,
  UIPanel,
  Axis,
  Point,
} from '@arction/lcjs';

// Methods
import dashboard from './methods/Dashboard';
import createChartPerChannel from './methods/Charts';
import createSeriesForEachChart from './methods/Series';
import xAxisChart from './methods/XAxisChart';
// import channelsUI from './methods/ChannelsUI';
import customCursor from './methods/CustomCursor';

// Constants
import { ChartType } from 'utils/constants';

class ChartClass {
  channelCount: number;
  seriesLineColorArr: string[];
  charts!: ChartXY<PointMarker, UIBackground>[];
  dashboard!: Dashboard;
  // ChartSyncXAxis: any;
  seriesLength: any;
  type: string;
  channels: string[];
  series!: LineSeries[];
  samplingRate: number;
  TOILegend: any;
  containerId: string;
  ChartOptions: any;
  UIPanel: null | UIPanel;
  xAxisChart!: ChartXY<PointMarker, UIBackground>;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    this.channels = channels || ['No Channel'];
    this.channelCount = channels.length;
    this.type = type;
    this.samplingRate = samplingRate;
    this.containerId = containerId;
    this.seriesLineColorArr = ['#E3170A', '#00FFFF', '#ABFF4F', '#FFFFFF']; //Colors for each series: ['red','yellow','cyan', 'white']
    this.TOILegend = null;
    this.ChartOptions = null;
    this.UIPanel = null;
  }

  createDashboard(numOfRows: number, container: string): Dashboard {
    this.dashboard = dashboard(numOfRows, container);
    this.charts = createChartPerChannel.bind(this)();
    this.series = createSeriesForEachChart.bind(this)();
    this.xAxisChart = xAxisChart.bind(this)();
    // channelsUI.bind(this)();
    customCursor.bind(this)();

    return this.dashboard;
  }

  translateXAxisPixelToAxisCoordinates(x: number, y: number) {
    const xAxisChart = this.xAxisChart as ChartXY<PointMarker, UIBackground>;
    const mouseLocationEngine = this.xAxisChart?.engine.clientLocation2Engine(
      x,
      y
    ) as Point;
    const point = translatePoint(mouseLocationEngine, xAxisChart.engine.scale, {
      x: xAxisChart.getDefaultAxisX(),
      y: xAxisChart.getDefaultAxisY(),
    });
    return point;
  }

  // Synchronizes all X axis to have the same interval/move at the same time
  synchronizeXAxis(charts: ChartXY<PointMarker, UIBackground>[]) {
    const syncedAxes = charts.map((chart) => chart.getDefaultAxisX());
    const xAxis = (this.xAxisChart &&
      this.xAxisChart.getDefaultAxisX()) as Axis;
    syncedAxes.unshift(xAxis);
    synchronizeAxisIntervals(...syncedAxes);
  }

  clearCharts() {
    this.series.forEach((series) => {
      series.clear();
      series.dispose();
      requestAnimationFrame(() => series.restore());
    });
    this.charts.forEach((chart) => {
      chart.getDefaultAxisX().setInterval(0, 30000);
      chart.getDefaultAxisY().setInterval(0, 50);
    });
  }

  memoryCleanup() {
    this.dashboard.forEachChart((chart) => {
      chart.dispose();
    });
    this.charts.forEach((chart) => chart.dispose());
    this.xAxisChart.dispose();
    // this.UIPanel?.dispose();
    this.dashboard.dispose();

    //@ts-ignore
    this.charts = undefined;
    //@ts-ignore
    this.series = undefined;
    //@ts-ignore
    this.xAxisChart = undefined;
    //@ts-ignore
    this.dashboard = undefined;
    //@ts-ignore
    this.charts = undefined;
  }
}

export default ChartClass;
