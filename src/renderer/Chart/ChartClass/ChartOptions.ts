import { ColorHEX, Dashboard, SolidFill, SolidLine } from '@arction/lcjs';

import { getState } from '@redux/store';

class ChartOptions {
  channels: string[];
  dashboard: Dashboard;
  charts: any;
  series: any;

  constructor(channels: string[], dashboard: any, charts: any, series: any) {
    this.channels = channels;
    this.dashboard = dashboard;
    this.charts = charts;
    this.series = series;
  }

  resetChartsHeight() {
    this.channels.forEach((_, i: number) => {
      this.dashboard.setRowHeight(i, 1);
    });
  }

  screenshot() {
    this.dashboard.saveToFile('Sensor Data');
  }

  addMarker(name: string, color: string) {
    const lastSeries = this.series[this.series.length - 1];
    const xValue = lastSeries.getBoundaries().max.x;

    const lastChart = this.charts[this.charts.length - 1];
    const axisX = lastChart.getDefaultAxisX();

    const state: any = getState().chartState;
    const eventState = state[name.toLocaleLowerCase()];

    axisX
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
    });
  }
}

export default ChartOptions;
