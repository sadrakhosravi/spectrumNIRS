import { ChartType } from '@utils/constants';
import Chart from './Chart';
import {
  ChartXY,
  Dashboard,
  LineSeries,
  PointMarker,
  UIBackground,
} from '@arction/lcjs';
import ChartOptions from './ChartOptions';

class ReviewChart extends Chart {
  numberOfRows: number;
  dashboard: null | Dashboard;
  charts: null | ChartXY<PointMarker, UIBackground>[];
  series: null | LineSeries[];
  chartOptions: null | ChartOptions;
  INTERVAL_LENGTH: number;
  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    super(channels, type, samplingRate, containerId);
    this.numberOfRows = this.channels.length;
    this.dashboard = null;
    this.charts = null;
    this.series = null;
    this.chartOptions = null;
    this.INTERVAL_LENGTH = 30000;
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
      this.series
    );
    this.listenForRightArrowKey();
  }

  listenForRightArrowKey() {
    window.addEventListener('keydown', this.loadDataOnKeyPress);
  }

  loadDataOnKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && this.charts) {
      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start + this.INTERVAL_LENGTH,
        end: currentInterval.end + this.INTERVAL_LENGTH,
      };
      this.charts.forEach((chart) =>
        chart
          .getDefaultAxisX()
          .setInterval(newInterval.start, newInterval.end, 300, true)
      );
    }

    if (event.key === 'ArrowLeft' && this.charts) {
      console.log(event.key);
      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start - this.INTERVAL_LENGTH,
        end: currentInterval.end - this.INTERVAL_LENGTH,
      };

      this.charts.forEach((chart) =>
        chart
          .getDefaultAxisX()
          .setInterval(newInterval.start, newInterval.end, 300, true)
      );
    }
  };

  customizeCharts() {}

  cleanup() {
    console.log('Destroy Chart');
    this.chartOptions = null;
    this.dashboard?.dispose();
    this.charts = null;
    this.series = null;
    window.removeEventListener('keydown', this.loadDataOnKeyPress);
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
