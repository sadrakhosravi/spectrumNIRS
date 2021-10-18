/**
 * Chart class
 */

// Import other chart classes
import ChartDashboard from 'renderer/Chart/ChartClass/ChartDashboard';
import ChartPerChannel from 'renderer/Chart/ChartClass/ChartPerChannel';
import ChartSeries from 'renderer/Chart/ChartClass/ChartSeries';
// import ChartSyncXAxis from '@chart/ChartClass/ChartSyncXAxis';

const on = window.api.on;

class ChartClass {
  channelCount: number;
  seriesLineColorArr: string[];
  dashboard: any;
  charts: any;
  Series: any;
  // ChartSyncXAxis: any;
  seriesLength: any;
  isReview: boolean;

  constructor(channelCount = 4, isReview = false) {
    this.channelCount = channelCount;
    this.isReview = isReview;
    this.seriesLineColorArr = ['#E3170A', '#ABFF4F', '#00FFFF', '#FFFFFF']; //Colors: ['red','yellow','cyan', 'white']

    // Create dashboard
    this.dashboard = new ChartDashboard(this.channelCount);
    this.dashboard = this.dashboard.createDashboard();

    // Charts for each channel
    this.charts = new ChartPerChannel(
      this.dashboard,
      this.channelCount,
      this.isReview
    );
    this.charts = this.charts.getCharts();

    // Series
    this.Series = new ChartSeries(this.charts, this.seriesLineColorArr);
    this.Series = this.Series.getSeries();

    // this.ChartSyncXAxis = new ChartSyncXAxis(
    //   this.dashboard,
    //   this.charts,
    //   this.Series,
    //   this.channelCount
    // );

    // Get series length
    this.seriesLength = this.Series.length;

    console.log('Class created');
  }

  cleanup() {
    this.dashboard.dispose();
    this.dashboard = null;
    this.charts = null;
    this.Series = null;
    // this.ChartSyncXAxis = null;
    // eslint-disable-next-line no-underscore-dangle
    window.api.removeChartEventListeners();
  }

  // Listens for data for the record page
  recordNIRSData() {
    on('data:nirs-reader', (data: any) => {
      // data format = 'TimeStamp,O2Hb,HHb,tHb,TOI' - data should contain 10 reading lines
      data.forEach((line: any) => {
        for (let i = 0; i < this.seriesLength; i++) {
          this.Series[i].add({ x: line[0], y: line[i + 1] });
        }
      });
    });
  }

  // Listens for events of the review page
  reviewNIRSData(data: Array<Object>) {
    console.log(data);
    // Loads all the data
    data.forEach((line: any) => {
      const data = line.value.split(',');
      this.Series[0].add({ x: data[0], y: parseFloat(data[1]) });
      this.Series[1].add({ x: data[0], y: parseFloat(data[2]) });
      this.Series[2].add({ x: data[0], y: parseFloat(data[3]) });
      this.Series[3].add({ x: data[0], y: parseFloat(data[4]) });
    });
  }
}

export default ChartClass;
