import {
  translatePoint,
  AxisTickStrategies,
  emptyLine,
  SolidLine,
  SolidFill,
  ColorHEX,
  emptyFill,
  AutoCursorModes,
  AxisScrollStrategies,
} from '@arction/lcjs';
import { nanoid } from 'nanoid';

// Modules
import { ChartSeries } from './ChartSeries';
import {
  hiddenLabelStyle,
  gridLineStyle,
  fontStyle,
  fontFillStyle,
} from './Theme';

// Types
import type { ChartType } from './ChartModel';
import type { VisibleTicks, AxisInterval } from '@arction/lcjs';

export class DashboardChart {
  /**
   * The current chart instance
   */
  public readonly chart: ChartType;
  /**
   * The row index of the chart in the dashboard.
   */
  public rowIndex: number;
  /**
   * A unique id to track the chart
   */
  public readonly id: string;
  /**
   * Y Axis interval before dispose
   */
  private interval: AxisInterval | null;

  constructor(chart: ChartType, rowIndex: number, id?: string) {
    this.chart = chart;
    this.rowIndex = rowIndex;
    this.id = id || nanoid();
    this.interval = null;
    this.setChartDefaults(this.chart);
  }

  /**
   * Gets the size of the current chart
   */
  public getSize() {
    // Get each chart position needed for aligning the ChannelUI elements
    // Get the top left corner
    const posEngine = translatePoint(
      { x: 0, y: 0 },
      this.chart.uiScale,
      this.chart.engine.scale
    );
    const posDocument = this.chart.engine.engineLocation2Client(
      posEngine.x,
      posEngine.y
    );

    const posEngine2 = translatePoint(
      { x: 100, y: 100 },
      this.chart.uiScale,
      this.chart.engine.scale
    );
    const posDocument2 = this.chart.engine.engineLocation2Client(
      posEngine2.x,
      posEngine2.y
    );

    const height = Math.abs(posDocument2.y - posDocument.y);
    const width = Math.abs(posDocument2.x - posDocument.x);

    return {
      x1: posDocument.x,
      x2: posDocument2.x,
      y1: posDocument2.y - 135,
      y2: posDocument2.y - 135,
      height,
      width,
    };
  }

  /**
   * @returns the chart row
   */
  public getChartRowIndex() {
    return this.rowIndex;
  }

  public getPointDiffInPixels(x1: number, x2: number) {
    const posEngine = translatePoint(
      { x: x1, y: 0 },
      this.chart.uiScale,
      this.chart.engine.scale
    );
    const posDocument = this.chart.engine.engineLocation2Client(
      posEngine.x,
      posEngine.y
    );

    const posEngine2 = translatePoint(
      { x: x2, y: 0 },
      this.chart.uiScale,
      this.chart.engine.scale
    );
    const posDocument2 = this.chart.engine.engineLocation2Client(
      posEngine2.x,
      posEngine2.y
    );

    return posDocument2.x - posDocument.x;
  }

  public getPointLocation(x: number) {
    const posEngine = translatePoint(
      { x, y: 0 },
      this.chart.uiScale,
      this.chart.engine.scale
    );
    const posDocument = this.chart.engine.engineLocation2Client(
      posEngine.x,
      posEngine.y
    );

    return posDocument.x;
  }

  /**
   * @returns the unique id of this dashboard chart instance
   */
  public getId() {
    return this.id;
  }

  /**
   * Disposes the chart instance.
   * @returns the row index of the chart to be freed in the dashboard.
   */
  public dispose() {
    this.chart.dispose();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.chart = null;
    return this.rowIndex;
  }

  /**
   * Gets the closes series point (if any) on a chart from the mouse location.
   * @returns nearestDataPoint - either `undefined` or an `object`.
   */
  public getNearestSeriesPointFromScreen(event: MouseEvent) {
    // `event` is a native JavaScript event, which packs the active mouse location in `clientX` and `clientY` properties.
    const mouseLocationClient = { x: event.clientX, y: event.clientY };

    // Before using client coordinates with LCJS, the coordinates have to be translated relative to the LCJS engine.
    const mouseLocationEngine = this.chart.engine.clientLocation2Engine(
      mouseLocationClient.x,
      mouseLocationClient.y
    );

    // Now that the coordinates are in the correct coordinate system, they can be used
    // to solve data points, or further translated to any Axis.

    // (2) Solve nearest data point from a series to the mouse.
    const nearestDataPoint = this.chart
      .getSeries()[0]
      .solveNearestFromScreen(mouseLocationEngine);
    if (!nearestDataPoint) return;

    const pixelLocation = translatePoint(
      // axis coordinate.
      nearestDataPoint.location,
      {
        x: this.chart.getDefaultAxisX(),
        y: this.chart.getDefaultAxisY(),
      },
      this.chart.engine.scale
    );

    const pixelLocationDocument = this.chart.engine.engineLocation2Client(
      pixelLocation.x,
      pixelLocation.y
    );

    return {
      x: pixelLocationDocument.x - 310,
      y: pixelLocationDocument.y - 98.5,
      xVal: nearestDataPoint.location.x,
      yVal: nearestDataPoint.location.y,
    };
  }

  /**
   * Adds a line series to the given chart
   * @returns the line series created
   */
  public addLineSeries(seriesName: string, seriesColor?: string): ChartSeries {
    const series = this.chart.addLineSeries({
      dataPattern: {
        pattern: 'ProgressiveX',
        regularProgressiveStep: true,
      },
    });

    // Add series name
    series.setName(seriesName);
    series.setDataCleaning({ minDataPointCount: 1 });

    const chartSeries = new ChartSeries(series, seriesColor, this.id);

    return chartSeries;
  }

  public removeGridLines() {
    const [axisX, axisY] = this.chart.getDefaultAxes();

    axisX
      .setTickStrategy(AxisTickStrategies.Time, (ticks) =>
        ticks
          .setMajorTickStyle((majorTick: VisibleTicks) =>
            majorTick
              .setLabelFillStyle(hiddenLabelStyle)
              .setGridStrokeStyle(emptyLine)
          )
          .setMinorTickStyle((minorTick: VisibleTicks) =>
            minorTick
              .setLabelFillStyle(hiddenLabelStyle)
              .setGridStrokeStyle(emptyLine)
          )
      )
      .setThickness(0)
      .setStrokeStyle(emptyLine)
      .setMouseInteractions(false);

    axisY.setTickStrategy(AxisTickStrategies.Numeric, (ticks) =>
      ticks
        .setMajorTickStyle((majorTickStyle) =>
          majorTickStyle
            .setTickLength(5)
            .setGridStrokeStyle(emptyLine)
            .setLabelFont(fontStyle)
            .setLabelFillStyle(fontFillStyle)
        )
        .setMinorTickStyle((minorTick: VisibleTicks) =>
          minorTick
            .setGridStrokeStyle(emptyLine)
            .setLabelFont(fontStyle)
            .setLabelFillStyle(fontFillStyle)
        )
    );
  }

  /**
   * Hides the chart axes to not overlap with other charts
   * while maximizing charts
   */
  public hideAxes() {
    const [xAxis, yAxis] = this.chart.getAxes();

    // Save the interval
    this.interval = yAxis.getInterval();

    xAxis
      .setThickness(0)
      .setTickStrategy(AxisTickStrategies.Empty)
      .setStrokeStyle(emptyLine)
      .setMouseInteractions(false);

    yAxis
      .setThickness(0)
      .setStrokeStyle(emptyLine)
      .setTickStrategy(AxisTickStrategies.Empty)
      .setMouseInteractions(false);
  }

  /**
   * Shows the chart's hidden axes.
   */
  public showAxes() {
    const [axisX, axisY] = this.chart.getDefaultAxes();

    this.setAxesStyles();

    requestAnimationFrame(() => {
      this.interval &&
        axisY.setInterval(
          this.interval.start || -50,
          this.interval.end || 50,
          false,
          true
        );
      axisX.release();
    });
  }

  /**
   * Sets the default axes style.
   */
  private setAxesStyles() {
    const [axisX, axisY] = this.chart.getDefaultAxes();

    // Remove X axis
    axisX
      .setTickStrategy(AxisTickStrategies.Time, (ticks) =>
        ticks
          .setMajorTickStyle((majorTick: VisibleTicks) =>
            majorTick
              .setLabelFillStyle(hiddenLabelStyle)
              .setGridStrokeStyle(gridLineStyle)
          )
          .setMinorTickStyle((minorTick: VisibleTicks) =>
            minorTick
              .setLabelFillStyle(hiddenLabelStyle)
              .setGridStrokeStyle(gridLineStyle)
          )
      )
      .setThickness(0)
      .setStrokeStyle(emptyLine)
      .setMouseInteractions(false);

    axisY.setTickStrategy(AxisTickStrategies.Numeric, (ticks) =>
      ticks
        .setMajorTickStyle((majorTickStyle) =>
          majorTickStyle
            .setTickLength(5)
            .setGridStrokeStyle(gridLineStyle)
            .setLabelFont(fontStyle)
            .setLabelFillStyle(fontFillStyle)
        )
        .setMinorTickStyle((minorTick: VisibleTicks) =>
          minorTick
            .setGridStrokeStyle(gridLineStyle)
            .setLabelFont(fontStyle)
            .setLabelFillStyle(fontFillStyle)
        )
    );

    // Axis Y defaults
    axisY
      .setNibMousePickingAreaSize(0)
      .setMouseInteractions(true)
      // .setMouseInteractions(false)
      // .setChartInteractions(false)
      // .setScrollStrategy(undefined)
      .setScrollStrategy(AxisScrollStrategies.fitting)
      .setNibStyle(emptyLine)
      .disableAnimations()
      .setThickness(65)
      .setStrokeStyle(
        new SolidLine({
          thickness: 1,
          fillStyle: new SolidFill({ color: ColorHEX('#333') }),
        })
      );
  }

  /**
   * Applies the default styles on current chart
   */
  private setChartDefaults(chart: ChartType) {
    const axisX = chart.getDefaultAxisX();
    axisX.setInterval(0, 30000);

    axisX.setScrollStrategy(AxisScrollStrategies.progressive);
    axisX.setChartInteractions(false);

    // Disable all charts listeners
    this.chart.setMouseInteractions(false);

    // Disable chart default cursors
    this.chart.setAutoCursorMode(AutoCursorModes.disabled);

    // Remove title
    chart.setTitleFillStyle(emptyFill);

    // Remove padding
    chart.setPadding({ top: 3, bottom: 5, left: 0, right: 0 });

    // Style the axes
    this.setAxesStyles();
  }
}
