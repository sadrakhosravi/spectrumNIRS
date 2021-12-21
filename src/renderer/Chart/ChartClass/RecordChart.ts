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
import { ChartChannels } from '@utils/channels';
import { getState, dispatch } from '@redux/store';
import { setPreviousData } from '@redux/ExperimentDataSlice';

class RecordChart extends Chart {
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
  createRecordChart() {
    this.dashboard = this.createDashboard(this.numberOfRows, this.containerId);
    this.charts = this.createChartPerChannel(this.channels, this.dashboard);
    this.series = this.createSeriesForEachChart(this.charts);
    this.synchronizeXAxis(this.charts);
    this.customizeChart(this.charts);
    this.customizeRecordCharts();
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
        this.TOILegend.setText(Math.round(data[data.length - 1][4]).toString());
        count = 0;
      }
      count++;
      requestAnimationFrame(() => {
        data.forEach((dataPoint: any) => {
          if (this.series) {
            this.series[0].add({ x: dataPoint[0], y: dataPoint[1] });
            this.series[1].add({ x: dataPoint[0], y: dataPoint[2] });
            this.series[2].add({ x: dataPoint[0], y: dataPoint[3] });
            this.series[3].add({ x: dataPoint[0], y: dataPoint[4] });
          }
        });
      });
    });
  }

  drawData(data: any) {
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

    requestAnimationFrame(() => {
      this.series && this.series[0].add(dataArr.splice(0, 10000));
      this.series && this.series[1].add(dataArr2.splice(0, 10000));
      this.series && this.series[2].add(dataArr3.splice(0, 10000));
      this.series && this.series[3].add(dataArr4.splice(0, 10000));
    });
    requestAnimationFrame(() => {
      this.charts?.forEach((chart) => chart.getDefaultAxisY().fit());
    });
  }

  loadLatestData = async () => {
    const data = await window.api.invokeIPC(
      ChartChannels.CheckForData,
      getState().experimentData.currentRecording.id
    );
    data.length > 1 && data.reverse();
    data.length > 1 && this.drawData(data);
    data.length > 1 &&
      dispatch(
        setPreviousData({
          timeStamp: data[data.length - 1].timeStamp,
          hasPreviousData: true,
        })
      );
  };

  customizeRecordCharts() {
    this.charts &&
      this.charts.forEach((chart, i) => {
        const axisX = chart.getDefaultAxisX();
        axisX.setMouseInteractions(false);

        chart.setMouseInteractionPan(false);

        this.series && this.series[i].setDataCleaning({ minDataPointCount: 1 });
      });
  }

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

export default RecordChart;
