/**
 * Chart class
 */

//Import other chart classes
import ChartDashboard from '@chart/ChartClass/ChartDashboard';
import ChartPerChannel from '@chart/ChartClass/ChartPerChannel';
import ChartSeries from '@chart/ChartClass/ChartSeries';
import ChartSyncXAxis from '@chart/ChartClass/ChartSyncXAxis';

const { ipcRenderer } = window.require('electron');

class ChartClass {
  constructor(channelCount = 4) {
    this.channelCount = channelCount;
    this.seriesLineColorArr = ['#E3170A', '#ABFF4F', '#00FFFF', '#FFFFFF']; //Colors: ['red','yellow','cyan', 'white']

    this.dashboard = new ChartDashboard(this.channelCount);
    this.charts = new ChartPerChannel(this.dashboard, this.channelCount);
    this.ChartSeries = new ChartSeries(this.charts, this.seriesLineColorArr);
    this.ChartSyncXAxis = new ChartSyncXAxis(
      this.dashboard,
      this.charts,
      this.ChartSeries,
      this.channelCount,
    );
    let ipc;

    console.log('Class created');
  }

  // /**
  //  * Creates a dashboard chart with total number of channels = channelCount.
  //  */
  // createDashboard() {
  //   this.dashboard = new ChartDashboard(this.channelCount);
  //   this.charts = new ChartPerChannel(this.dashboard, this.channelCount);
  //   this.ChartSeries = new ChartSeries(this.charts, this.seriesLineColorArr);
  //   this.ChartSyncXAxis = new ChartSyncXAxis(
  //     this.dashboard,
  //     this.charts,
  //     this.ChartSeries,
  //     this.channelCount,
  //   );
  //   return this.ChartSeries;
  // }

  cleanup() {
    this.dashboard.dispose();
    this.dashboard = null;
    this.charts = null;
    this.ChartSeries = null;
    this.ChartSyncXAxis = null;
    ipcRenderer._events = {};

    console.log(ipcRenderer);

    console.log(this.ChartSeries);
  }

  addData(x, y) {
    ipcRenderer.on('testdata', (event, data) => {
      this.ChartSeries.forEach(_series => {
        _series.add({ x: data.TimeStamp / 1000, y: data.Probe0.O2Hb });
      });
    });

    console.log(ipcRenderer);
  }
}

export default ChartClass;
