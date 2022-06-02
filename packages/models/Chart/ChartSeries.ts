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
  /**
   * The sampling rate of the device controlling this series.
   */
  private samplingRate: number;

  public dataBuffY: number[];
  newDataModulus: number;
  newDataPointsCount: number;
  timeDelta: number;

  constructor(series: LineSeries, seriesColor: string | undefined, chartId: string) {
    this.series = series;
    this.chartId = chartId;

    this.seriesColor = seriesColor;
    this.seriesGainVal = 1;
    this.lowpassFilter = null;

    this.dataBuffY = [];

    this.samplingRate = 100;
    this.timeDelta = 1000 / this.samplingRate;

    // Variables used for appending data calculation
    this.newDataPointsCount = 0;
    this.newDataModulus = 0;

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
   * The sampling rate of the device controlling the series.
   */
  public get seriesSamplingRate() {
    return this.samplingRate;
  }

  /**
   * @returns the parent chart's unique id
   */
  public getChartId() {
    return this.chartId;
  }

  /**
   * Sets the series sampling rate.
   */
  public setSeriesSamplingRate(samplingRate: number) {
    this.samplingRate = samplingRate;

    // Update time delta too
    this.timeDelta = 1000 / this.samplingRate;
  }

  /**
   * Appends data to the internal series data buffer to the plotted.
   */
  public addData(y: number[]) {
    // this.dataBuffY = this.dataBuffY.concat(y);
    this.addArrayY(y, 10);
  }

  /**
   * Check for the incoming data points and append the internal buffer smoothly.
   */
  public appendData(tDelta: number) {
    // The number of new data points to be added
    this.newDataPointsCount = this.samplingRate * (tDelta / 1000) + this.newDataModulus;
    this.newDataModulus = this.newDataPointsCount % 1;
    this.newDataPointsCount = Math.floor(this.newDataPointsCount);

    this.addArrayY(this.dataBuffY, this.timeDelta);
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
  public addArrayY(data: Float32Array | Int32Array | number[], start: number) {
    const deviceCalibFactor = 1;
    const gainVal = this.seriesGainVal;

    if (this.lowpassFilter) {
      this.lowpassFilter.multiStep(data, true);
    }

    // For is faster here
    for (let i = 0; i < data.length; i++) {
      data[i] *= gainVal * deviceCalibFactor;
    }

    this.series.addArrayY(data, this.timeDelta, start);
  }

  /**
   * Applies the gain value and adds obj array to the series.
   */
  public addArrayXY(x: number[] | Float32Array, y: number[] | Float32Array) {
    const deviceCalibFactor = 1;
    const gainVal = this.seriesGainVal;

    const length = y.length;
    // For each is faster here
    for (let i = 0; i < length; i++) {
      y[i] = y[i] * gainVal * deviceCalibFactor;
    }

    if (this.lowpassFilter) {
      this.lowpassFilter.multiStep(y, true);
    }

    this.series.addArraysXY(
      (x as number[]).splice(0, this.newDataPointsCount),
      (y as number[]).splice(0, this.newDataPointsCount),
    );
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
   * Clears the series and remove all data points.
   */
  public clearData() {
    this.series.clear();
  }

  /**
   * Changes the current series color.
   * @param color the new color to set for the series.
   */
  @action public changeSeriesColor(color: string) {
    this.series.setStrokeStyle(
      new SolidLine({
        thickness: 0.5,
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
      this.addArrayY(arrY, 10);
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
