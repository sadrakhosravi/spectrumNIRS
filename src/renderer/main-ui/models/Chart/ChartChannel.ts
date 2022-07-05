import { computed, makeObservable, observable } from 'mobx';

// Types
import type { ChartType } from './ChartModel';
import type { LineSeries, SolidFill } from '@arction/lcjs';

export class ChartChannel {
  /**
   * The chart that the channel is attached to.
   */
  public readonly chart: ChartType;
  /**
   * The series that the channel attached to.
   */
  @observable public readonly series: LineSeries[] | undefined;

  constructor(chart: ChartType, series?: LineSeries[] | undefined) {
    this.chart = chart;
    this.series = series;

    makeObservable(this);
  }

  /**
   * @returns the `name`, `color`, and `thickness` of the attached series.
   */
  @computed get seriesInfo() {
    const info = this.series?.map((series) => {
      return {
        name: series.getName(),
        color: (series.getStrokeStyle().getFillStyle() as SolidFill).getColor(),
        thickness: series.getStrokeStyle().getThickness(),
      };
    });
    return info;
  }
}
