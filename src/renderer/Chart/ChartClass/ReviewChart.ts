import { ChartType } from '@utils/constants';
import Chart from './Chart';
import {
  AxisScrollStrategies,
  AxisTickStrategies,
  ChartXY,
  ColorHEX,
  ColorRGBA,
  Dashboard,
  emptyFill,
  // emptyFill,
  LineSeries,
  PointMarker,
  SolidFill,
  SolidLine,
  UIBackground,
  ZoomBandChart,
} from '@arction/lcjs';
import ChartOptions from './ChartOptions';
import { getState, dispatch } from '@redux/store';
import { setIsLoadingData } from '@redux/AppStateSlice';

import { ChartChannels } from '@utils/channels';
import AccurateTimer from '@electron/helpers/accurateTimer';

class ReviewChart extends Chart {
  numberOfRows: number;
  dashboard: null | Dashboard;
  charts: null | ChartXY<PointMarker, UIBackground>[];
  series: null | LineSeries[];
  chartOptions: null | ChartOptions;
  zoomBandChart: undefined | ZoomBandChart;
  XMax: number;
  XMin: number;
  DATA_LOADING_THRESHOLD: number;
  endOfData: boolean;
  isLoadingData: boolean;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    super(channels, type, samplingRate, containerId);
    this.numberOfRows = this.channels.length + 1;
    this.dashboard = null;
    this.charts = null;
    this.series = null;
    this.chartOptions = null;
    this.zoomBandChart = undefined;
    this.XMax = 3000;
    this.XMin = 0;
    this.DATA_LOADING_THRESHOLD = 30 * 1000;
    this.endOfData = false;
    this.isLoadingData = false;
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
    this.createZoomBandChart();
    this.listenForRightArrowKey();
    this.synchronizeXAxis(this.charts);
    this.customizeZoomBandChart();
    this.checkIntervalChange();
    this.loadAllEvents();
  }

  loadInitialData = async () => {
    dispatch(setIsLoadingData(true));
    const recordingId = getState().experimentData?.currentRecording?.id;
    if (!recordingId) return;
    const data = await window.api.invokeIPC(ChartChannels.GetDataForInterval, {
      recordingId,
      start: 0,
      end: 300000,
    });
    if (data.length !== 0) {
      data.reverse();
      this.XMax = data[data.length - 1].timeStamp;
      console.log(data[data.length - 1]);
      this.drawDataOnCharts(data, { start: 0, end: 300000 });
    } else {
      this.endOfData = true;
      dispatch(setIsLoadingData(false));
    }
  };

  drawDataOnCharts = (data: any, _interval: { start: number; end: number }) => {
    const DATA_LENGTH = data.length;
    const dataArr: any[] = [];
    const dataArr2: any[] = [];
    const dataArr3: any[] = [];
    const dataArr4: any[] = [];
    const events: any[] = [];
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
      data[i].events && events.push(data[i]);
      dataArr.push(O2Hb);
      dataArr2.push(HHb);
      dataArr3.push(THb);
      dataArr4.push(TOI);
    }

    const plottingTimer = new AccurateTimer(() => {
      requestAnimationFrame(() => {
        this.series && this.series[0].add(dataArr.splice(0, 10000));
        this.series && this.series[1].add(dataArr2.splice(0, 10000));
        this.series && this.series[2].add(dataArr3.splice(0, 10000));
        this.series && this.series[3].add(dataArr4.splice(0, 10000));
      });
      requestAnimationFrame(() => {
        this.charts?.forEach((chart) => chart.getDefaultAxisY().fit());
      });

      if (dataArr.length === 0) {
        this.chartOptions?.addEventsToCharts(events);

        plottingTimer.stop();
        return;
      }
    }, 50);

    plottingTimer.start();

    dispatch(setIsLoadingData(false));
    this.isLoadingData = false;
  };

  getIntervalDataAndDraw = async (interval: { start: number; end: number }) => {
    const recordingId = getState().experimentData?.currentRecording?.id;
    if (!recordingId) return;
    const data = await window.api.invokeIPC(ChartChannels.GetDataForInterval, {
      recordingId,
      ...interval,
    });
    data && this.drawDataOnCharts(data, interval);
  };

  listenForRightArrowKey() {
    window.addEventListener('keydown', this.loadDataOnKeyPress);
  }

  loadDataOnKeyPress = async (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && this.charts) {
      const timeDivision = this.chartOptions?.timeDivision as number;
      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start + timeDivision,
        end: currentInterval.end + timeDivision,
      };
      this.setInterval(newInterval.start, newInterval.end);
    }

    if (event.key === 'ArrowLeft' && this.charts) {
      const timeDivision = this.chartOptions?.timeDivision as number;
      const axisX = this.charts[0].getDefaultAxisX();
      const currentInterval = axisX.getInterval();
      const newInterval = {
        start: currentInterval.start - timeDivision,
        end: currentInterval.end - timeDivision,
      };
      this.setInterval(newInterval.start, newInterval.end);
    }
  };

  setInterval(start: number, end?: number) {
    const timeDivision = this.chartOptions?.getTimeDivision() as number;
    if (this.charts) {
      this.charts[0]
        .getDefaultAxisX()
        .setInterval(start, end || start + timeDivision, 0, true);
    }
  }

  checkIntervalChange() {
    let previousIntervalStart = 0;
    if (this.charts) {
      this.charts[0].getDefaultAxisX().onScaleChange((start, _end) => {
        // Prevent redundant calls if the interval start is the same
        if (start !== previousIntervalStart && !this.isLoadingData) {
          previousIntervalStart = start;
          const currentInterval =
            this.charts &&
            (this.charts[0].getDefaultAxisX().getInterval() as any);
          if (
            Math.abs(currentInterval.end - this.XMax) <=
              this.DATA_LOADING_THRESHOLD &&
            !this.endOfData
          ) {
            console.log(this.endOfData);
            this.loadDataFromInterval();
          }
        }
      });
    }
  }

  loadDataFromInterval = async () => {
    this.isLoadingData = true;
    dispatch(setIsLoadingData(true));
    if (this.charts) {
      const data = await window.api.invokeIPC(
        ChartChannels.GetDataForInterval,
        {
          recordingId: getState().experimentData.currentRecording.id,
          start: this.XMax,
          end: this.XMax + 300000,
        }
      );
      if (data.length > 1) {
        data.reverse();
        this.XMax = data[data.length - 1].timeStamp;
        this.drawDataOnCharts(data, { start: 0, end: 300000 });
      } else {
        this.isLoadingData = false;
        this.endOfData = true;
        dispatch(setIsLoadingData(false));
      }
    }
  };

  loadAllEvents = async () => {
    const data = await window.api.invokeIPC(
      ChartChannels.GetAllEvents,
      getState().experimentData.currentRecording.id
    );
    console.log(data);
  };

  createZoomBandChart() {
    this.zoomBandChart = this.dashboard
      ?.createZoomBandChart({
        rowIndex: this.channels.length,
        columnIndex: 1,
        columnSpan: 1,
        axis: (this.charts as any).map((chart: any) => chart.getDefaultAxisX()),
      })
      .setTitleFillStyle(emptyFill)
      .setPadding(0);
  }

  customizeZoomBandChart() {
    this.zoomBandChart?.band.setValueStart(0);
    this.zoomBandChart?.band.setValueEnd(30000);
    this.zoomBandChart?.band.setFillStyle(
      new SolidFill({ color: ColorRGBA(255, 255, 255, 50) })
    );
    this.zoomBandChart?.band.setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(255, 255, 255, 150) }),
      })
    );
    this.zoomBandChart
      ?.getDefaultAxisX()
      .setTickStrategy(AxisTickStrategies.Time);

    let count = 0;
    this.zoomBandChart?.setSeriesStyle((series) => {
      //@ts-ignore
      series.setStrokeStyle(
        new SolidLine({
          thickness: 0.5,
          fillStyle: new SolidFill({
            color: ColorHEX(this.seriesLineColorArr[count]),
          }),
        })
      );
      count++;
    });
  }

  customizeCharts() {
    this.charts?.forEach((chart, i) => {
      // Disable rectangle zoom
      // chart.setMouseInteractionRectangleZoom(false);
      // // Disable right click drag
      // // chart.setMouseInteractionPan(false);
      // // Disable rectangle fit
      // chart.setMouseInteractionRectangleFit(false);
      // Disable mouse interaction on x axis and zoom on wheel

      // Automatic Data Cleaning

      this.series &&
        this.series[i].setDataCleaning({ minDataPointCount: 30000 });

      this.dashboard?.setRowHeight(i, 1);

      chart
        .getDefaultAxisX()
        .setInterval(0, 30000)
        .setScrollStrategy(AxisScrollStrategies.regressive)
        .setMouseInteractions(false)
        .setChartInteractionZoomByWheel(false)
        .setTitleFillStyle(emptyFill);

      chart.getDefaultAxisY().setScrollStrategy(AxisScrollStrategies.fitting);
    });
    this.dashboard?.setRowHeight(4, 0.7);
  }

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
