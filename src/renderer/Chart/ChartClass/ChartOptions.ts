import { ColorHEX, Dashboard, SolidFill, SolidLine } from '@arction/lcjs';

import { getState } from '@redux/store';

class ChartOptions {
  channels: string[];
  dashboard: Dashboard;
  charts: any;
  series: any;
  customTicks: any[];
  constantLines: any[];
  timeDivision: number;

  constructor(channels: string[], dashboard: any, charts: any, series: any) {
    this.channels = channels;
    this.dashboard = dashboard;
    this.charts = charts;
    this.series = series;
    this.customTicks = [];
    this.constantLines = [];
    this.timeDivision = 30 * 1000; // Time in milliseconds - default 30s
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
   * Sets the new time division to be used for the related chart
   * @param newTimeDivision - New time division to be set in milliseconds
   */
  setTimeDivision(newTimeDivision: number) {
    this.timeDivision = newTimeDivision;
    if (this.charts) {
      const currentInterval = this.charts[0].getDefaultAxisX().getInterval();
      console.log(currentInterval);
      this.charts[0]
        .getDefaultAxisX()
        .setInterval(
          currentInterval.start,
          currentInterval.start + this.timeDivision,
          0,
          true
        );
    }
  }

  /**
   * Gets the current time division in milliseconds `default: 30s`
   * @returns current time division in milliseconds
   */
  getTimeDivision() {
    return this.timeDivision;
  }

  addMarker(name: string, color: string) {
    const lastSeries = this.series[this.series.length - 1];
    const xValue = lastSeries.getBoundaries().max.x;

    const lastChart = this.charts[this.charts.length - 1];
    const axisX = lastChart.getDefaultAxisX();

    const state: any = getState().chartState;
    const eventState = state[name.toLocaleLowerCase()];

    const customTick = axisX
      .addCustomTick()
      .setValue(xValue)
      .setTextFormatter((_value: any) =>
        eventState ? `${name}:End` : `${name}:Start`
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
