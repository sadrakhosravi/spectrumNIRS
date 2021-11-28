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
  }

  listenForData() {
    let count = 0;
    window.api.onIPCData('data:reader-record', (_event, data) => {
      // Change TOI value every 15 samples (based on 100samples/s)
      if (count === 5) {
        this.TOILegend.setText(Math.round(data[4]).toString());
        count = 0;
      }
      count++;
      // data format = 'TimeStamp,O2Hb,HHb,tHb,TOI' - data should contain 3 reading lines
      requestAnimationFrame(() => {
        for (let i = 0; i < (this.series as LineSeries[]).length; i++) {
          (this.series as LineSeries[])[i].add({ x: data[0], y: data[i + 1] });
        }
      });
    });
  }

  customizeCharts() {}

  cleanup() {
    console.log('Destroy Chart');
    this.chartOptions = null;
    this.dashboard?.dispose();
    this.charts = null;
    this.series = null;
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
