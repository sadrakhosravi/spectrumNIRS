/*---------------------------------------------------------------------------------------------
 *  Chart Channel View Model.
 *  Uses Mobx observable pattern.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { autorun, makeObservable, observable } from 'mobx';

// Types
import type { IChart } from './ChartViewModel';

export class ChartChannelViewModel {
  /**
   * The chart view model instance
   */
  @observable protected chart: IChart;
  constructor(chart: IChart) {
    this.chart = chart;

    makeObservable(this);

    autorun(() => console.log(this.chart.series.length));
  }
}
