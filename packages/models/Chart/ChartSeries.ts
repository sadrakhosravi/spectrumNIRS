import { XYDataGenerator } from './XYDataGenerator';

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
  /**
   * The current color of the series line stroke
   */
  private seriesColor: string | undefined;

  constructor(series: LineSeries, seriesColor: string | undefined, chartId: string) {
    this.series = series;
    this.chartId = chartId;
    this.seriesColor = seriesColor;
    this.setLineSeriesStrokeStyle();
  }

  /**
   * @returns the parent chart's unique id
   */
  public getChartId() {
    return this.chartId;
  }

  /**
   * @returns the current stroke color of the series.
   */
  public getSeriesColor() {
    return this.seriesColor;
  }

  /**
   * Sets the line series stroke thickness and color
   */
  private setLineSeriesStrokeStyle() {
    this.series.setStrokeStyle(
      new SolidLine({
        thickness: -1,
        fillStyle: new SolidFill({ color: ColorHEX(this.seriesColor || '#00FFFF') }),
      }),
    );
    this.seriesColor = this.seriesColor || '#00FFFF';
  }

  /**
   * Changes the current series color.
   * @param color the new color to set for the series.
   */
  public changeSeriesColor(color: string) {
    this.series.setStrokeStyle(
      new SolidLine({
        thickness: -1,
        fillStyle: new SolidFill({ color: ColorHEX(color || '#fff') }),
      }),
    );
    this.seriesColor = color;
  }

  /**
   * Generates and appends a random data to the series
   */
  public generateDummyData() {
    const data = XYDataGenerator.staticData(30000);
    data.then((points) => this.series.add(points));
  }
}
