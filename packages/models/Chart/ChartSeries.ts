/*---------------------------------------------------------------------------------------------
 *  Chart Series Model.
 *  Logic for chart series.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';
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
  /**
   * Series gain value
   */
  @observable public seriesGainVal: number;

  constructor(series: LineSeries, seriesColor: string | undefined, chartId: string) {
    this.series = series;
    this.chartId = chartId;
    this.seriesColor = seriesColor;
    this.seriesGainVal = 1;
    this.setLineSeriesStrokeStyle();
    makeObservable(this);
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
   * @returns the gail value of the series.
   */
  public getSeriesGainVal() {
    return this.seriesGainVal;
  }

  /**
   * Sets the series gain value.
   */
  @action public setSeriesGain(value: number) {
    if (value < 0) return;
    this.seriesGainVal = value;
  }

  /**
   * Applies the gain value and adds Array of the data to the series.
   */
  public addArrayY(data: Float32Array | number[]) {
    console.time('gain');
    // For each is faster here
    data.forEach((point) => (point *= this.seriesGainVal));
    console.timeEnd('gain');

    this.series.addArrayY(data);
  }

  /**
   * Applies the gain value and adds obj array to the series.
   */
  public addArrayXY(data: { x: number; y: number }[]) {
    console.time('gain');
    // For each is faster here
    data.forEach((point) => (point.y *= this.seriesGainVal));
    console.timeEnd('gain');

    this.series.add(data);
  }

  /**
   * Applies the gain value and adds single data point to the series.
   */
  public addPoint(data: { x: number; y: number }) {
    data.y *= this.seriesGainVal;

    this.series.add(data);
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
    const data = XYDataGenerator.streamData(100);
    data.forEach((point) => this.addPoint(point));
  }

  /**
   * Disposes the series and all its belongings.
   */
  public dispose() {
    this.series.dispose();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.series = null;
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
}
