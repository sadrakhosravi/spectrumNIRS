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
    this.Series = new ChartSeries(this.charts, this.seriesLineColorArr);
    this.ChartSyncXAxis = new ChartSyncXAxis(this.dashboard, this.charts, this.Series, this.channelCount);

    this.seriesLength = this.Series.length;

    console.log('Class created');
  }

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

  addNIRSData() {
    ipcRenderer.on('data:nirs-reader', (event, data) => {
      //data format = 'TimeStamp,O2Hb,HHb,tHb,TOI'.
      for (let i = 0; i < this.seriesLength; i++) {
        this.Series[i].add({ x: data[0], y: data[i + 1] });
      }
    });
  }
}

export default ChartClass;
