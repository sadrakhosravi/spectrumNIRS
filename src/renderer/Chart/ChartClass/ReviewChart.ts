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
import { getState } from '@redux/store';
import { ChartChannels } from '@utils/channels';

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
    this.customizeCharts();
    this.listenForRightArrowKey();
  }

  drawDataOnCharts = (data: any, interval: { start: number; end: number }) => {
    const DATA_LENGTH = data.length;
    const dataArr: any[] = [];
    const dataArr2: any[] = [];
    const dataArr3: any[] = [];
    const dataArr4: any[] = [];
    // Using for loop for fastest possible execution
    for (let i = 0; i < DATA_LENGTH; i++) {
      const O2Hb = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].O2Hb.toFixed(2)),
      };
      const HHb = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].HHb.toFixed(2)),
      };
      const THb = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].THb.toFixed(2)),
      };
      const TOI = {
        x: parseInt(data[i].timeStamp),
        y: parseFloat(data[i].TOI.toFixed(2)),
      };
      dataArr.push(O2Hb);
      dataArr2.push(HHb);
      dataArr3.push(THb);
      dataArr4.push(TOI);
    }
    this.clearCharts();
    this.series && this.series[0].add(dataArr.reverse().splice(0, 3000));
    this.series && this.series[1].add(dataArr2.reverse().splice(0, 3000));
    this.series && this.series[2].add(dataArr3.reverse().splice(0, 3000));
    this.series && this.series[3].add(dataArr4.reverse().splice(0, 3000));

    requestAnimationFrame(() =>
      this.charts?.forEach((chart) => {
        chart
          .getDefaultAxisX()
          .setInterval(interval.start, interval.end, 0, false);
      })
    );
    requestAnimationFrame(() =>
      this.charts?.forEach((chart) => {
        chart.getDefaultAxisY().fit();
      })
    );
  };

  listenForRightArrowKey() {
    window.addEventListener('keydown', this.loadDataOnKeyPress);
  }

  getIntervalDataAndDraw = async (interval: { start: number; end: number }) => {
    const recordingId = getState().experimentData?.currentRecording?.id;
    if (!recordingId) return;
    const data = await window.api.invokeIPC(ChartChannels.GetDataForInterval, {
      recordingId,
      ...interval,
    });
    data && this.drawDataOnCharts(data, interval);
  };

  loadDataOnKeyPress = async (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && this.charts) {
      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start + this.INTERVAL_LENGTH,
        end: currentInterval.end + this.INTERVAL_LENGTH,
      };
      this.getIntervalDataAndDraw(newInterval);
    }

    if (event.key === 'ArrowLeft' && this.charts) {
      console.log(event.key);
      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start - this.INTERVAL_LENGTH,
        end: currentInterval.end - this.INTERVAL_LENGTH,
      };

      console.log(newInterval);

      this.getIntervalDataAndDraw(newInterval);
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
