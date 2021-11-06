import { ColorHEX, Dashboard, SolidFill, SolidLine } from '@arction/lcjs';

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

  addMarker() {
    this.charts.forEach((chart: any) => {
      const cl = chart.getDefaultAxisX().addConstantLine();
      cl.setName('CL')
        .setValue(5)
        .setHighlightOnHover(true)
        .setMouseInteractions(false)

        .setStrokeStyle(
          new SolidLine({
            thickness: 4,
            fillStyle: new SolidFill({ color: ColorHEX('#007ACD') }),
          })
        )
        .setStrokeStyleHighlight(
          new SolidLine({
            thickness: 8,
            fillStyle: new SolidFill({ color: ColorHEX('#007ACD') }),
          })
        );
    });
  }
}

export default ChartOptions;
