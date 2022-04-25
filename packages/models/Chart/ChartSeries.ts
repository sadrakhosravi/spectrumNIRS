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
  private readonly seriesColor: string | undefined;

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
   * Sets the line series stroke thickness and color
   */
  private setLineSeriesStrokeStyle() {
    this.series.setStrokeStyle(
      new SolidLine({
        thickness: -1,
        fillStyle: new SolidFill({ color: ColorHEX(this.seriesColor || '#00FFFF') }),
      }),
    );
  }

  /**
   * Generates and appends a random data to the series
   */
  public generateDummyData() {
    const dataStream = XYDataGenerator.streamData(3);
    dataStream.forEach((data) => this.series.add(data));
  }
}
