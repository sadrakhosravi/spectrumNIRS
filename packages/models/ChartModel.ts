/*---------------------------------------------------------------------------------------------
 *  Singleton Calibration Model.
 *  Uses MobX observable pattern
 *--------------------------------------------------------------------------------------------*/

import { makeAutoObservable } from 'mobx';

// Types
import type { Chart } from '/@/charts';

export class ChartModel {
  /**
   * The instance of the chart
   */
  chartInstance: Chart | null;

  constructor() {
    this.chartInstance = null;
    makeAutoObservable(this);
  }

  /**
   * Sets the current chart instance in the observable model
   */
  public set setChartInstance(instance: Chart) {
    this.chartInstance = instance;
  }
}

export default new ChartModel();
