import {
  ChartXY,
  ColorHEX,
  Dashboard,
  FontSettings,
  LineSeries,
  PointMarker,
  SolidFill,
  SolidLine,
  UIBackground,
  UIElementBuilders,
} from '@arction/lcjs';
import { getState } from '@redux/store';

type Charts = ChartXY<PointMarker, UIBackground>[];

class ChartEvents {
  dashboard: Dashboard;
  charts: ChartXY<PointMarker, UIBackground>[];
  events: any[];
  series: LineSeries[];
  constantLines: any[];
  constructor(dashboard: Dashboard, charts: Charts, series: LineSeries[]) {
    this.dashboard = dashboard;
    this.charts = charts;
    this.series = series;
    this.events = [];
    this.constantLines = [];
  }

  public addEvent(name: string, color: string) {
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

    customTick.setMarker((tickMarker) =>
      tickMarker.setTextFont(
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

    this.events.push(customTick);
  }
}

export default ChartEvents;
