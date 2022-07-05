/*---------------------------------------------------------------------------------------------
 *  X Axis Model.
 *  Handles the X axis logic as a LCJS chart.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import {
  AxisScrollStrategies,
  AxisTickStrategies,
  emptyFill,
  emptyLine,
  lightningChart as lcjs,
  synchronizeAxisIntervals,
} from '@arction/lcjs';
import { spectrumTheme, fontStyle, fontFillStyle } from './Theme';

// Types
import type {
  AxisInterval,
  VisibleTicks,
  SynchronizeAxisIntervalsHandle,
} from '@arction/lcjs';
import type { ChartType } from './ChartModel';

export class XAxisModel {
  /**
   * The chart that the X axis chart will attach to
   */
  private attachedChart: ChartType | null;
  /**
   * The X axis chart
   */
  private xAxisChart: ChartType | null;
  /**
   * The handler for X axis synchronization
   */
  private synchronizeHandler: SynchronizeAxisIntervalsHandle | null;

  constructor() {
    this.attachedChart = null;
    this.xAxisChart = null;
    this.synchronizeHandler = null;
  }

  /**
   * Creates the X Axis chart and attaches its intervals it to the given chart
   */
  public init(containerId: string, chart: ChartType) {
    this.attachedChart = chart;
    this.createXAxisChart(containerId);
    this.setXAxisDefaults();
  }

  /**
   * @returns the x axis chart.
   */
  public getChart() {
    return this.xAxisChart;
  }

  /**
   * @returns the attached chart instance.
   */
  public getAttachedChart() {
    return this.attachedChart;
  }

  /**
   * @returns the x axis of the chart or null if empty.
   */
  public getXAxis() {
    return this.xAxisChart?.getDefaultAxisX();
  }

  /**
   * Listeners and memory cleanup
   */
  public dispose() {
    this.synchronizeHandler?.remove();
    this.synchronizeHandler = null;

    this.attachedChart = null;
    this.xAxisChart?.dispose();
    this.xAxisChart = null;
  }

  /**
   * Creates the X axis chart instance
   */
  private createXAxisChart(container: string) {
    this.xAxisChart = lcjs().ChartXY({
      maxFps: 50,
      container,
      antialias: true,
      lineAntiAlias: true,
      theme: spectrumTheme,
    });

    // Synchronize intervals
    this.synchronizeHandler = synchronizeAxisIntervals(
      this.xAxisChart.getDefaultAxisX(),
      (this.attachedChart as ChartType).getDefaultAxisX()
    );
  }

  /**
   * Sets the default layout and styles of the X axis chart.
   */
  private setXAxisDefaults() {
    const chart = this.xAxisChart as ChartType;
    const [xAxis, yAxis] = chart.getDefaultAxes();

    // Set the default interval based on the attached chart interval
    const interval = this.attachedChart
      ?.getDefaultAxisX()
      .getInterval() as AxisInterval;
    xAxis.setInterval(interval.start, interval.end);

    // Remove the title and paddings
    chart.setTitleFillStyle(emptyFill);
    chart.setPadding(0);
    chart.setMouseInteractions(false);

    // Dispose the yAxis
    yAxis.dispose();

    // Remove the X Axis lines
    xAxis
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setTickStrategy(AxisTickStrategies.Time, (tickStrategy) =>
        tickStrategy
          .setMajorTickStyle((majorTick: VisibleTicks) =>
            majorTick.setLabelFont(fontStyle).setLabelFillStyle(fontFillStyle)
          )

          .setMinorTickStyle((minorTick: VisibleTicks) =>
            minorTick.setLabelFont(fontStyle).setLabelFillStyle(fontFillStyle)
          )
      );
    xAxis
      .setStrokeStyle(emptyLine)
      .setNibLength(0)
      .setMouseInteractions(false)
      .setChartInteractions(false);

    xAxis.restore();
    this.attachedChart?.getDefaultAxisX().release();
  }
}
