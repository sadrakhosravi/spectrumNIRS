/**
 * Chart class
 */

// Import other chart classes
import ChartDashboard from '@chart/ChartClass/ChartDashboard';
import ChartPerChannel from '@chart/ChartClass/ChartPerChannel';
import ChartSeries from '@chart/ChartClass/ChartSeries';
import ChartSyncXAxis from '@chart/ChartClass/ChartSyncXAxis';

const on = window.api.on;

class ChartClass {
  channelCount: number;

  seriesLineColorArr: string[];

  dashboard: any;

  charts: any;

  Series: any;

  ChartSyncXAxis: any;

  seriesLength: any;

  constructor(channelCount = 4) {
    this.channelCount = channelCount;
    this.seriesLineColorArr = ['#E3170A', '#ABFF4F', '#00FFFF', '#FFFFFF']; //Colors: ['red','yellow','cyan', 'white']

    // Create dashboard
    this.dashboard = new ChartDashboard(this.channelCount);
    this.dashboard = this.dashboard.createDashboard();

    // Charts for each channel
    this.charts = new ChartPerChannel(this.dashboard, this.channelCount);
    this.charts = this.charts.getCharts();

    // Series
    this.Series = new ChartSeries(this.charts, this.seriesLineColorArr);
    this.Series = this.Series.getSeries();

    this.ChartSyncXAxis = new ChartSyncXAxis(
      this.dashboard,
      this.charts,
      this.Series,
      this.channelCount
    );

    this.seriesLength = this.Series.length;

    console.log('Class created');
  }

  cleanup() {
    this.dashboard.dispose();
    this.dashboard = null;
    this.charts = null;
    this.Series = null;
    this.ChartSyncXAxis = null;
    // eslint-disable-next-line no-underscore-dangle
    window.api.removeNIRSDataListener();
  }

  addNIRSData() {
    on('data:nirs-reader', (data: any) => {
      // data format = 'TimeStamp,O2Hb,HHb,tHb,TOI' - data should contain 10 reading lines
      data.forEach((line: any) => {
        for (let i = 0; i < this.seriesLength; i++) {
          this.Series[i].add({ x: line[0], y: line[i + 1] });
        }
      });
    });

    on('data:nirs-reader-review', (data: any) => {
      // data format = 'TimeStamp,O2Hb,HHb,tHb,TOI'
      data.forEach((line: any) => {
        for (let i = 0; i < this.seriesLength; i++) {
          const data = line.value.split(',');
          this.Series[i].add({
            x: parseFloat(data[0]),
            y: parseFloat(data[i + 1]),
          });
        }
      });
    });
  }
}

export default ChartClass;
