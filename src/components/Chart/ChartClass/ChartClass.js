/**
 * Chart class
 */

//Import other chart classes
import ChartDashboard from '@chart/ChartClass/ChartDashboard';
import ChartPerChannel from '@chart/ChartClass/ChartPerChannel';
import ChartSeries from '@chart/ChartClass/ChartSeries';
import ChartSyncXAxis from '@chart/ChartClass/ChartSyncXAxis';

export default class ChartClass {
  constructor(channelCount = 4) {
    this.channelCount = channelCount;
    this.seriesLineColorArr = ['#E3170A', '#ABFF4F', '#00FFFF', '#FFFFFF']; //Colors: ['red','yellow','cyan', 'white']

    this.createDashboardChart(); //Create chart and display it on the page.
  }

  /**
   * Creates a dashboard chart with total number of channels = channelCount.
   */
  createDashboardChart() {
    this.dashboard = new ChartDashboard(this.channelCount);
    this.charts = new ChartPerChannel(this.dashboard, this.channelCount);
    this.ChartSeries = new ChartSeries(this.charts, this.seriesLineColorArr);
    this.ChartSyncXAxis = new ChartSyncXAxis(
      this.dashboard,
      this.charts,
      this.ChartSeries,
      this.channelCount,
    );
  }
}
