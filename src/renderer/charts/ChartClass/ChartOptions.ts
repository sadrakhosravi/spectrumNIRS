import {
  ChartXY,
  ColorHEX,
  ColorRGBA,
  Dashboard,
  FontSettings,
  PointMarker,
  SolidFill,
  SolidLine,
  UIBackground,
  UIElementBuilders,
  UIPointableTextBox,
} from '@arction/lcjs';
import { setAllEvents } from '@redux/ChartSlice';
import { getState, dispatch } from '@redux/store';
import msToTime from '@utils/msToTime';

class ChartOptions {
  channels: string[];
  dashboard: Dashboard;
  charts: ChartXY<PointMarker, UIBackground>[];
  series: any;
  customTicks: any[];
  constantLines: any[];
  timeDivision: number;
  isReview: boolean;
  xAxisChart: ChartXY<PointMarker, UIBackground>;

  constructor(
    channels: string[],
    dashboard: any,
    charts: any,
    series: any,
    isReview: boolean = false,
    xAxisChart?: any
  ) {
    this.channels = channels;
    this.dashboard = dashboard;
    this.charts = charts;
    this.series = series;
    this.customTicks = [];
    this.constantLines = [];
    this.timeDivision = 30 * 1000; // Time in milliseconds - default 30s
    this.isReview = isReview;
    this.xAxisChart = xAxisChart;
  }

  /**
   * Gets if the currentChart options is for the review tab
   * @returns true if this chart options is for review chart or false otherwise
   */
  getIsReview() {
    return this.isReview;
  }

  /**
   * Resets the height of each chart back to default equal heights
   */
  resetChartsHeight() {
    this.dashboard.setRowHeight(0, 0.3);
    this.dashboard.setRowHeight(1, 1);
    this.dashboard.setRowHeight(2, 1);
    this.dashboard.setRowHeight(3, 1);
    this.dashboard.setRowHeight(4, 1);
    this.dashboard.setRowHeight(5, 0.5);
    this.dashboard.setColumnWidth(0, 1);
    this.dashboard.setColumnWidth(1, 11);
  }

  /**
   * Takes a screenshot of the chart area
   */
  screenshot() {
    this.dashboard.saveToFile('Sensor Data', 'image/png');
  }

  /**
   * Gets the current time division in milliseconds `default: 30s`
   * @returns current time division in milliseconds
   */
  getTimeDivision() {
    return this.timeDivision;
  }

  /**
   * Sets the new time division to be used for the related chart
   * @param newTimeDivision - New time division to be set in milliseconds
   */
  setTimeDivision(newTimeDivision: number) {
    this.timeDivision = newTimeDivision;
    const axisX = this.charts[0].getDefaultAxisX();
    const currentInterval = axisX.getInterval();
    if (this.isReview) {
      console.log('REVIEW');
      axisX.setInterval(
        currentInterval.start,
        currentInterval.start + this.timeDivision,
        0,
        true
      );
    } else {
      const xMax = this.series[0].getXMax();
      const xMin = this.series[0].getXMin();
      if (xMax <= this.timeDivision) {
        axisX.setInterval(xMin, xMin + this.timeDivision);
      } else {
        axisX.setInterval(xMax - this.timeDivision, xMax);
      }

      axisX.release();
    }
  }

  addMarker(name: string, color: string) {
    const lastSeries = this.series[this.series.length - 1];
    const xValue = lastSeries.getBoundaries().max.x;

    const lastChart = this.charts[this.charts.length - 1];
    const axisX = lastChart.getDefaultAxisX();

    const state: any = getState().chartState;
    const eventState = state[name.toLocaleLowerCase()];

    const customTick = axisX
      .addCustomTick(UIElementBuilders.PointableTextBox)
      .setValue(xValue)
      .setTextFormatter((_value: any) =>
        eventState ? `${name}:End` : `${name}:Start`
      );

    //@ts-ignore
    customTick.setMarker((tickMarker: UIPointableTextBox) =>
      tickMarker
        // ^ Above type cast is necessary to access full configuration API of UIPointableTextBox
        // Style TickMarker background fill color.
        .setBackground((background) =>
          background.setFillStyle(
            new SolidFill({ color: ColorRGBA(0, 0, 0, 100) })
          )
        )
        .setTextFont(
          new FontSettings({
            size: 14,
          })
        )
    );

    this.charts.forEach((chart: any) => {
      const cl = chart.getDefaultAxisX().addConstantLine();
      cl.setName('CL')
        .setValue(xValue)
        .setHighlightOnHover(true)
        .setMouseInteractions(false)

        .setStrokeStyle(
          new SolidLine({
            thickness: 4,
            fillStyle: new SolidFill({ color: ColorHEX(color) }),
          })
        );
      this.constantLines.push(cl);
    });

    this.customTicks.push(customTick);
  }

  drawMarker(xValue: number, name: string, color: string) {
    const axisX = this.xAxisChart?.getDefaultAxisX();

    const customTick = axisX
      .addCustomTick()
      .setValue(xValue)
      .setMarker((tickMarker) =>
        tickMarker.setTextFillStyle(
          new SolidFill({
            color: ColorHEX(color),
          })
        )
      )
      .setTextFormatter((_value: any) => name);

    this.charts.forEach((chart: any) => {
      const cl = chart.getDefaultAxisX().addConstantLine();
      cl.setName('CL')
        .setValue(xValue)
        .setHighlightOnHover(true)
        .setMouseInteractions(false)

        .setStrokeStyle(
          new SolidLine({
            thickness: 3,
            fillStyle: new SolidFill({ color: ColorHEX(color) }),
          })
        );
      this.constantLines.push(cl);
    });
    return customTick;
  }

  /**
   * Adds the given events to each chart
   * @param events Array of events
   */
  addEventsToCharts(data: any[]) {
    const DATA_LENGTH = data.length;
    const eventsArr = [];
    let hypoxia = false;
    let event2 = false;
    // Using for loop for maximum performance
    for (let i = 0; i < DATA_LENGTH; i++) {
      const events = JSON.parse(data[i].events);
      if (events.hypoxia && !hypoxia) {
        this.drawMarker(data[i].timeStamp, 'Hypoxia: Start', '#FFF');
        eventsArr.push({
          timeStamp: data[i].timeStamp,
          time: msToTime(data[i].timeStamp),
          name: 'Hypoxia',
          color: '#FFF',
        });
        hypoxia = true;
      }
      if (!events.hypoxia && hypoxia) {
        this.drawMarker(data[i].timeStamp, 'Hypoxia: End', '#FFF');
        hypoxia = false;
      }
      if (events.event2 && !event2) {
        this.drawMarker(data[i].timeStamp, 'Event2', '#333');
        event2 = true;
        eventsArr.push({
          timeStamp: data[i].timeStamp,
          time: msToTime(data[i].timeStamp),
          name: 'Event2',
          color: '#FFF',
        });
      }
      if (!events.event2 && event2) {
        this.drawMarker(data[i].timeStamp, 'Event2: End', '#333');
        event2 = false;
      }
    }
    dispatch(setAllEvents(eventsArr));
  }

  clearCharts() {
    this.customTicks.forEach((customTick: any) => {
      customTick.dispose();
    });
    this.constantLines.forEach((constantLine: any) => {
      constantLine.dispose();
    });
  }

  public memoryCleanup() {
    this.constantLines.forEach((line) => line.dispose());
    this.customTicks.forEach((tick) => tick.dispose());

    //@ts-ignore
    this.dashboard = undefined;
    //@ts-ignore
    this.charts = undefined;
    this.series = undefined;
    //@ts-ignore
    this.customTicks = undefined;
    //@ts-ignore
    this.constantLines = undefined;
  }
}

export default ChartOptions;
