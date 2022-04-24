/*---------------------------------------------------------------------------------------------
 *  Charts X Axis View Model.
 *  Uses Mobx observable pattern.
 *  Handles the X axis UI ticks and logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable, configure } from 'mobx';
import { msToTime } from '../../utils/helpers';
import type { IChart } from './ChartViewModel';

export type TicksType = {
  x: number;
  text?: string;
};

configure({
  enforceActions: 'never',
});

export class ChartsXAxisViewModel {
  /**
   * The chart that the X axis will be attached to
   * Typically should be the first chart.
   */
  attachedChart: IChart;
  /**
   * The DIV container of all the ticks.
   */
  containerDiv: HTMLDivElement;
  /**
   * The pixel gap between each major ticks.
   */
  majorTickGap: number;
  /**
   * An observable array of ticks
   */
  @observable ticks: TicksType[];
  /**
   * The coefficient of converting chart scale to window pixels
   */
  chartToPixelCoef: number;
  /**
   * The total number of ticks
   */
  totalTicks: number;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.attachedChart = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.containerDiv = null;
    this.majorTickGap = 0;
    this.totalTicks = 11;
    this.ticks = [];
    this.chartToPixelCoef = 0;
    makeObservable(this);
  }

  /**
   * Attaches the X axis to the chart passed on.
   * Typically it should be the first chart in the observable.
   */
  public attachToChart(chart: IChart, containerDiv: HTMLDivElement) {
    this.attachedChart = chart;
    this.containerDiv = containerDiv;
    this.init();
  }

  /**
   * Initializes the chart x axis and does initial calculations
   */
  private init() {
    setTimeout(() => {
      this.calcMajorTickGap();
      this.addTicks();
    }, 1000);
  }

  /**
   * @returns the current chart's interval
   */
  protected getInterval() {
    return (this.attachedChart as IChart).dashboardChart.chart.getDefaultAxisX().getInterval();
  }

  /**
   * Calculates the gap between each major tick
   */
  private calcMajorTickGap() {
    // const yAxisWidth = this.attachedChart.dashboardChart.chart.getDefaultAxisY().getThickness().max;
    const chartWidth = this.containerDiv.getBoundingClientRect().width; // -65px for the y axis
    console.log(chartWidth);

    if (chartWidth < 620) {
      this.totalTicks = 7;
    }

    const correctionFactor = 0;

    // Set variables
    this.majorTickGap = chartWidth / this.totalTicks - correctionFactor;

    console.log(this.majorTickGap); // 1 is used for pixel offset correction
  }

  @action private addTicks() {
    const interval = this.getInterval();
    const intervalDiff = interval.end - interval.start;

    this.ticks.length = 0;

    for (let i = 0; i < this.totalTicks; i++) {
      const tick: TicksType = {
        x: i * this.majorTickGap,
        text: msToTime(i * intervalDiff + interval.start),
      };

      this.ticks.push(tick);
    }

    this.updateTicks();
  }

  @action updateTicks() {
    const axisX = this.attachedChart.dashboardChart.chart.getDefaultAxisX();

    let lastTickVal = this.getInterval().end;

    axisX.onScaleChange((_start, end) => {
      const pixelsMoved = (lastTickVal + end) * this.chartToPixelCoef;
      console.log(pixelsMoved);

      lastTickVal = end;
    });
  }
}
