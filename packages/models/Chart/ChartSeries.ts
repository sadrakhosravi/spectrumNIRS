import type { LineSeries } from '@arction/lcjs';

// Types
import { ColorHEX, SolidFill, SolidLine } from '@arction/lcjs';

export class ChartSeries {
  /**
   * The current series instance
   */
  public readonly series: LineSeries;
  /**
   * The id of the chart owning the series
   */
  private readonly chartId: string;

  constructor(series: LineSeries, chartId: string) {
    this.series = series;
    this.chartId = chartId;
    this.setLineSeriesStrokeStyle();
  }

  /**
   * @returns the parent chart's unique id
   */
  public getChartId() {
    return this.chartId;
  }

  /**
   * Sets the line series stroke thickness and color
   */
  private setLineSeriesStrokeStyle() {
    this.series.setStrokeStyle(
      new SolidLine({
        thickness: -1,
        fillStyle: new SolidFill({ color: ColorHEX('#F00') }),
      }),
    );
  }
}
