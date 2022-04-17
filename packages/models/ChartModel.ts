/*---------------------------------------------------------------------------------------------
 *  Singleton Calibration Model.
 *  Uses MobX observable pattern
 *--------------------------------------------------------------------------------------------*/

import { makeAutoObservable } from 'mobx';

// Types
import type { Chart } from '/@/charts';
import type { ChartType } from '/@/charts/types';

export class ChartModel {
  /**
   * The instance of the chart
   */
  chartInstance: Chart | null;
  /**
   * An array of all chart's channels
   */
  charts: ChartType[];

  constructor() {
    this.chartInstance = null;
    this.charts = [];
    makeAutoObservable(this);
  }

  /**
   * Sets the current chart instance in the observable model
   */
  public set setChartInstance(instance: Chart) {
    this.chartInstance = instance;
  }

  /**
   * Adds a chart to the current chart dashboard instance
   */
  public set addChart(chart: ChartType) {
    this.charts.push(chart);
  }
}

export default new ChartModel();
