import {
  ColorHEX,
  ColorRGBA,
  Dashboard,
  FontSettings,
  SolidFill,
  SolidLine,
  UIElementBuilders,
  UIPointableTextBox,
} from '@arction/lcjs';
import { setAllEvents } from '@redux/ChartSlice';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getState, dispatch } from '@redux/store';

class ChartOptions {
  channels: string[];
  dashboard: Dashboard;
  charts: any;
  series: any;
  customTicks: any[];
  constantLines: any[];
  timeDivision: number;
  isReview: boolean;

  constructor(
    channels: string[],
    dashboard: any,
    charts: any,
    series: any,
    isReview: boolean = false
  ) {
    this.channels = channels;
    this.dashboard = dashboard;
    this.charts = charts;
    this.series = series;
    this.customTicks = [];
    this.constantLines = [];
    this.timeDivision = 30 * 1000; // Time in milliseconds - default 30s
    this.isReview = isReview;
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
    this.dashboard.setRowHeight(0, 1);
    this.dashboard.setRowHeight(1, 1);
    this.dashboard.setRowHeight(2, 1);
    this.dashboard.setRowHeight(3, 1);
    this.dashboard.setRowHeight(4, 0.7);
  }

  /**
   * Takes a screenshot of the chart area
   */
  screenshot() {
    this.dashboard.saveToFile('Sensor Data');
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
    if (this.charts) {
      const currentInterval = this.charts[0].getDefaultAxisX().getInterval();
      console.log(currentInterval);
      const axisX = this.charts[0].getDefaultAxisX();

      axisX.setInterval(
        currentInterval.start,
        currentInterval.start + this.timeDivision,
        0,
        true
      );

      !this.isReview && axisX.release();
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
    const axisX =
      this.charts && this.charts[this.charts.length - 1].getDefaultAxisX();

    const customTick = axisX
      .addCustomTick(UIElementBuilders.AxisTick)
      .setValue(xValue)

      .setTextFormatter((_value: any) => name);

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
    return customTick;
  }

  /**
   * Adds the given events to each chart
   * @param events Array of events
   */
  addEventsToCharts(data: any[]) {
    dayjs.extend(duration);
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
          time: dayjs.duration(data[i].timeStamp).format('HH:mm:ss'),
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
          time: dayjs.duration(data[i].timeStamp).format('HH:mm:ss'),
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
}

export default ChartOptions;
