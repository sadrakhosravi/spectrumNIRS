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
import type { Filter } from '../Filters/Lowpass';

// View Models
// import { deviceManagerVM } from '../../viewmodels/VMStore';
import { Lowpass } from '../Filters';

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
  @observable private seriesColor: string | undefined;
  /**
   * Series gain value
   */
  @observable private seriesGainVal: number;
  /**
   * Lowpass filter instance or none.
   */
  @observable private lowpassFilter: Filter | null;

  constructor(series: LineSeries, seriesColor: string | undefined, chartId: string) {
    this.series = series;
    this.chartId = chartId;

    this.seriesColor = seriesColor;
    this.seriesGainVal = 1;
    this.lowpassFilter = null;

    this.setLineSeriesStrokeStyle();
    this.setSeriesCleaning(30 * 1000);

    makeObservable(this);
  }

  /**
   * @returns the series color.
   */
  public get color() {
    return this.seriesColor;
  }

  /**
   * @returns the series gain value.
   */
  public get gainVal() {
    return this.seriesGainVal;
  }

  /**
   * @returns the current lowpass filter instance.
   */
  public get lpFilter() {
    return this.lowpassFilter;
  }

  /**
   * @returns the parent chart's unique id
   */
  public getChartId() {
    return this.chartId;
  }

  /**
   * Sets the series gain value.
   */
  @action public setSeriesGain(value: number) {
    if (value < 0) return;
    this.seriesGainVal = value;
  }

  /**
   * Creates or replaces the lowpass filter for the series.
   * @param samplingRate the sampling rate of the device.
   * @param cutoff the cutoff frequency of the lowpass filter.
   * @param order the order of the lowpass filter.
   */
  @action public addSeriesLowpassFilter(samplingRate: number, cutoff: number, order: number) {
    this.lowpassFilter = new Lowpass().createLowpassFilter(samplingRate, cutoff, order);
  }

  /**
   * Removes the lowpass filter instance.
   */
  @action public removeSeriesLowpassFilter() {
    this.lowpassFilter = null;
  }

  /**
   * Applies the gain value and adds Array of the data to the series.
   */
  public addArrayY(data: Float32Array | Int32Array | number[], step?: number) {
    const deviceCalibFactor = 1;
    const gainVal = this.seriesGainVal;

    if (this.lowpassFilter) {
      this.lowpassFilter.multiStep(data, true);
    }

    // For each is faster here
    data.forEach((point) => (point *= gainVal * deviceCalibFactor));

    this.series.addArrayY(data, step);
  }

  /**
   * Applies the gain value and adds obj array to the series.
   */
  public addArrayXY(data: { x: number; y: number }[]) {
    const deviceCalibFactor = 1;
    const gainVal = this.seriesGainVal;

    console.time('gain');
    // For each is faster here
    data.forEach((point) => (point.y *= gainVal * deviceCalibFactor));
    console.timeEnd('gain');

    this.series.add(data);
  }

  /**
   * Applies the gain value and adds single data point to the series.
   */
  public addPoint(data: { x: number; y: number }) {
    const deviceCalibFactor = 1;
    const gainVal = this.seriesGainVal;

    if (this.lowpassFilter) {
      this.lowpassFilter.singleStep(data.y, true);
    }
    data.y *= gainVal * deviceCalibFactor;

    this.series.add(data);
  }

  /**
   * Changes the current series color.
   * @param color the new color to set for the series.
   */
  @action public changeSeriesColor(color: string) {
    this.series.setStrokeStyle(
      new SolidLine({
        thickness: -1,
        fillStyle: new SolidFill({ color: ColorHEX(color || '#fff') }),
      }),
    );
    this.seriesColor = color;
  }

  /**
   * Generates and appends a random data to the series.
   */
  public generateDummyStreamData() {
    const data = XYDataGenerator.streamData(10);
    data.forEach((point) => this.addPoint(point));
  }

  /**
   * Generates a static data and appends it to the series.
   */
  public generateDummyStaticData() {
    const data = XYDataGenerator.staticData(30 * 1000);
    data.then((dp) => {
      const arrY = dp.map((point) => point.y);
      this.addArrayY(arrY);
    });
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
   * Sets the series data cleaning threshold.
   */
  public setSeriesCleaning(numOfPointsToKeep: number) {
    this.series.setDataCleaning({ minDataPointCount: numOfPointsToKeep });
  }

  /**
   * Sets the line series stroke thickness and color.
   */
  private setLineSeriesStrokeStyle() {
    // Set the ambient color to white.
    if (this.series.getName().toLocaleLowerCase() === 'ambient') {
      this.changeSeriesColor('#fff');
      return;
    }

    this.changeSeriesColor(this.seriesColor || '#fff');
  }
}
