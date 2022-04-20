import {
  translatePoint,
  AxisTickStrategies,
  emptyLine,
  SolidLine,
  SolidFill,
  ColorHEX,
  AxisScrollStrategies,
  emptyTick,
  emptyFill,
} from '@arction/lcjs';
import Hyperid from 'hyperid';

// Modules
import { ChartSeries } from './ChartSeries';
import { uiMinorTickFont } from './Theme';

// Types
import type { ChartType } from './ChartModel';

export class DashboardChart {
  /**
   * The current chart instance
   */
  public readonly chart: ChartType;
  /**
   * A unique id to track the chart
   */
  public readonly id: string;

  constructor(chart: ChartType, id?: string) {
    this.chart = chart;
    this.id = id || Hyperid()();
    this.setChartDefaults(this.chart);
  }

  /**
   * Gets the size of the current chart
   */
  public getSize() {
    // Get each chart position needed for aligning the ChannelUI elements
    // Get the top left corner
    const posEngine = translatePoint({ x: 0, y: 0 }, this.chart.uiScale, this.chart.engine.scale);
    const posDocument = this.chart.engine.engineLocation2Client(posEngine.x, posEngine.y);

    const posEngine2 = translatePoint(
      { x: 100, y: 100 },
      this.chart.uiScale,
      this.chart.engine.scale,
    );
    const posDocument2 = this.chart.engine.engineLocation2Client(posEngine2.x, posEngine2.y);

    const height = Math.abs(posDocument2.y - posDocument.y);
    const width = Math.abs(posDocument2.x - posDocument.x);

    return { x: posDocument.x, y: posDocument2.y - 95, height, width };
  }

  /**
   * @returns the unique id of this dashboard chart instance
   */
  public getId() {
    return this.id;
  }

  /**
   * Adds a line series to the given chart
   * @returns the line series created
   */
  public addLineSeries(seriesName: string, seriesColor?: string): ChartSeries {
    const series = this.chart.addLineSeries({
      dataPattern: {
        pattern: 'ProgressiveX',
      },
    });

    // Add series name
    series.setName(seriesName);
    series.setDataCleaning({ minDataPointCount: 1 });

    const chartSeries = new ChartSeries(series, seriesColor, this.id);

    return chartSeries;
  }

  /**
   * Hides the chart axes to not overlap with other charts
   * while maximizing charts
   */
  public hideAxes() {
    const [xAxis, yAxis] = this.chart.getAxes();

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

  public showAxes() {
    const yAxis = this.chart.getDefaultAxisY();

    yAxis
      .setThickness(65)
      .setTickStrategy(AxisTickStrategies.Numeric)
      .setStrokeStyle(
        new SolidLine({
          thickness: 1,
          fillStyle: new SolidFill({ color: ColorHEX('#333') }),
        }),
      )
      .setMouseInteractions(true);
  }

  /**
   * Applies the default styles on current chart
   */
  private setChartDefaults(chart: ChartType) {
    const [axisX, axisY] = chart.getDefaultAxes();
    axisX.setInterval(0, 10000);

    // Remove X axis
    axisX
      .setThickness(0)
      .setStrokeStyle(emptyLine)
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setAnimationsEnabled(true)
      .setTickStrategy(AxisTickStrategies.Empty)
      .setStrokeStyle(emptyLine)
      .setMouseInteractions(false);

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
  }
}
