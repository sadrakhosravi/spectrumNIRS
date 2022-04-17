/**
 * The base class for creating charts.
 * Includes basic functions such as creation dashboard, charts, and series
 *
 * @author Sadra Khosravi
 * @version 0.1.0-Alpha.1
 */

import {
  AxisScrollStrategies,
  AxisTickStrategies,
  emptyFill,
  emptyLine,
  emptyTick,
  lightningChart as lcjs,
  translatePoint,
} from '@arction/lcjs';
import type { Dashboard } from '@arction/lcjs';

// Spectrum Theme
import { spectrumTheme, uiMinorTickFont } from './Theme/Theme';

// Types
import { ChartType } from './types';

// Structures
import { SortedNumberSet } from '@utils/structures';

// Controller
import { ChartController } from '@controllers/ChartController';

/**
 *
 *  The base class for creating charts.
 * @version 0.1.0-Alpha.1
 */
export class ChartBase {
  /**
   * Total number of rows possible at any given instance of the chart
   */
  private readonly maxRowCount = 20;
  /**
   * A Set of all the available rows in the given instance
   */
  private availableRows: SortedNumberSet;
  /**
   * The LCJS dashboard instance.
   */
  protected dashboard: Dashboard | undefined;
  /**
   * An array of all the available chart instances of LCJS
   */
  protected charts: ChartType[];

  constructor() {
    this.availableRows = new SortedNumberSet(new Array(20).fill(0).map((_, i) => i));
    this.dashboard = undefined;
    this.charts = [];
  }

  /**
   * @returns the dashboard instance
   */
  public getDashboard() {
    return this.dashboard as Dashboard;
  }

  /**
   * Creates an instance of a chart in current dashboard
   */
  public addChartXY() {
    const firstAvailableRow = this.availableRows.getFirstAvailableItem();
    const chart = this.dashboard?.createChartXY({
      columnIndex: 0,
      rowIndex: firstAvailableRow,
      defaultAxisX: undefined,
    }) as ChartType;

    this.charts?.push(chart);
    this.setChartDefaults(chart);
    this.updateChartsHeight();

    ChartController.addChart(chart);
  }

  /**
   * Adds a line series to the given chart
   * @returns the line series created
   */
  public addLineSeries(seriesName: string, chart: ChartType) {
    const series = chart.addLineSeries({
      dataPattern: {
        pattern: 'ProgressiveX',
      },
    });

    // Add series name
    series.setName(seriesName);
    series.setDataCleaning({ minDataPointCount: 1 });

    return series;
  }

  /**
   * Creates a dashboard instance of LCJS
   */
  protected createDashboard(chartContainerId: string) {
    this.dashboard = lcjs().Dashboard({
      numberOfColumns: 1,
      numberOfRows: this.maxRowCount,
      disableAnimations: true,
      maxFps: 40,
      antialias: true,
      container: chartContainerId,
      lineAntiAlias: true,
      devicePixelRatio: true,
      theme: spectrumTheme,
    });
  }

  /**
   * Applies the default styles on all charts
   */
  protected setChartDefaults(chart: ChartType) {
    const [axisX, axisY] = chart.getDefaultAxes();

    // Remove X axis
    axisX
      .setThickness(0)
      .setStrokeStyle(emptyLine)
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setAnimationsEnabled(true)
      .setTickStrategy(AxisTickStrategies.Empty)
      .setStrokeStyle(emptyLine);

    // Axis Y defaults
    axisY
      .setNibMousePickingAreaSize(0)
      .disableAnimations()
      .setNibStyle(emptyLine)
      .setThickness(65)
      .setInterval(-50, 50);

    axisY.setTickStrategy(AxisTickStrategies.Numeric, (ticks) =>
      ticks
        .setMajorTickStyle((majorTickStyle) =>
          majorTickStyle
            .setTickLength(5)
            .setGridStrokeStyle(emptyLine)
            .setLabelFont(uiMinorTickFont),
        )
        .setMinorTickStyle(emptyTick),
    );

    // Remove title
    chart.setTitleFillStyle(emptyFill);

    // Remove padding
    chart.setPadding({ top: 3, bottom: 5, left: 150, right: 0 });

    // Remove splitter
    this.dashboard?.setSplitterStyle(emptyLine);
  }

  /**
   * Gets the size of the chart passed in
   */
  public getChartSize(chart: ChartType) {
    // Get each chart position needed for aligning the ChannelUI elements
    // Get the top left corner
    const posEngine = translatePoint({ x: 0, y: 0 }, chart.uiScale, chart.engine.scale);
    const posDocument = chart.engine.engineLocation2Client(posEngine.x, posEngine.y);

    const posEngine2 = translatePoint({ x: 100, y: 100 }, chart.uiScale, chart.engine.scale);
    const posDocument2 = chart.engine.engineLocation2Client(posEngine2.x, posEngine2.y);

    const height = Math.abs(posDocument2.y - posDocument.y);
    const width = Math.abs(posDocument2.x - posDocument.x);

    return { x: posDocument.x, y: posDocument2.y - 95, height, width };
  }

  /**
   * Updates the height of all charts in the dashboard
   */
  private updateChartsHeight() {
    // Set the height of available charts
    for (let row = 0; row < this.maxRowCount; row++) {
      this.dashboard?.setRowHeight(row, 0);
    }

    this.charts?.forEach((_, iChart) => {
      this.dashboard?.setRowHeight(iChart, 1);
    });
  }

  /**
   * Memory cleanup. Required to free the memory properly
   */
  public cleanup() {
    this.charts?.forEach((chart) => chart?.dispose());

    //@ts-ignore
    this.charts = undefined;

    this.dashboard?.dispose();
    this.dashboard = undefined;
  }
}
