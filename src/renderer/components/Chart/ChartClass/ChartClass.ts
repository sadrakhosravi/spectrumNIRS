/**
 * Chart class
 */

// Import other chart classes
import ChartDashboard from '@chart/ChartClass/ChartDashboard';
import ChartPerChannel from '@chart/ChartClass/ChartPerChannel';
import ChartSeries from '@chart/ChartClass/ChartSeries';
import ChartSyncXAxis from '@chart/ChartClass/ChartSyncXAxis';

const { ipcRenderer }: any = window.require('electron');

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
    ipcRenderer._events = {};
  }

  addNIRSData() {
    ipcRenderer.on('data:nirs-reader', (_: any, data: any) => {
      // data format = 'TimeStamp,O2Hb,HHb,tHb,TOI'

      for (let i = 0; i < this.seriesLength; i++) {
        this.Series[i].add({ x: data[0], y: data[i + 1] });
      }
    });
  }
}

export default ChartClass;
