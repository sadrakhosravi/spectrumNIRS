/*---------------------------------------------------------------------------------------------
 *  Bar Chart Model.
 *  Used for probe intensity calibration.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import {
  AutoCursorModes,
  AxisScrollStrategies,
  AxisTickStrategies,
  ColorHEX,
  ColorRGBA,
  lightningChart,
  SolidFill,
  SolidLine,
  UIElementBuilders,
} from '@arction/lcjs';

// Types
import type { ChartType } from './index';
import type {
  VisibleTicks,
  RectangleSeries,
  RectangleFigure,
  Axis,
  CustomTick,
} from '@arction/lcjs';
import type { ChannelDataType } from '../../renderer/reader/types/DeviceDataType';

// Theme
import { spectrumTheme, textFillStyle, uiMajorTickFont, uiMinorTickFont } from './Theme';

export class BarChartModel {
  /**
   * LCJS chart instance.
   */
  private chart: ChartType | null;
  /**
   * The rectangle series instance.
   */
  private rectangleSeries: RectangleSeries | null;
  /**
   * Each LED as a rectangle in the rectangle series.
   */
  private rectangles: RectangleFigure[];
  /**
   * The gap between each rectangles
   */
  private seriesGap: 40;
  /**
   * Each rectangle's width
   */
  private rectWidth: 25;
  /**
   * Custom tick labels for LEDs
   */
  private customTicks: CustomTick[];
  /**
   * Red color for rectangles
   */
  protected redColor: SolidFill;
  /**
   * Blue color for rectangles
   */
  private blueColor: SolidFill;
  /**
   * White color for rectangles
   */
  private whiteColor: SolidFill;

  constructor() {
    this.chart = null;
    this.rectangleSeries = null;
    this.rectangles = [];
    this.customTicks = [];

    // Constants
    this.seriesGap = 40;
    this.rectWidth = 25;
    this.redColor = new SolidFill().setColor(ColorRGBA(242, 67, 79));
    this.blueColor = new SolidFill().setColor(ColorRGBA(42, 171, 240));
    this.whiteColor = new SolidFill().setColor(ColorRGBA(255, 255, 255));
  }

  /**
   * Creates the chart and applies default settings.
   */
  public init(container: string) {
    this.createChart(container);
    this.customizeAxes();
    this.createRectangleSeries();
  }

  /**
   * Adds the data to the series and plots the data on the graph.
   * @param data Channel Data Type
   */
  public addData(data: ChannelDataType) {
    for (let i = 1; i < this.rectangles.length; i++) {
      // Only plot the last value in the array.
      const dataPointY = data[`led${i}`][-1];

      // Update rectangle dimensions.
      this.rectangles[i].setDimensions({
        ...this.rectangles[i].getDimensionsPositionAndSize(),
        height: dataPointY,
      });
    }
  }

  /**
   * Disposes the chart.
   */
  public dispose() {
    this.customTicks.forEach((tick) => tick.dispose());
    this.customTicks.length = 0;

    this.rectangles.forEach((rectangle) => rectangle.dispose());
    this.rectangles.length = 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.rectangles = null;

    this.rectangleSeries?.dispose();
    this.rectangleSeries = null;

    requestAnimationFrame(() => {
      this.chart?.dispose();
      this.chart = null;
    });
  }

  /**
   * Creates a rectangle for each LED.
   * @param totalLEDs the total number of LEDs of the device.
   */
  public addLEDs(totalLEDs: number) {
    const series = this.rectangleSeries as RectangleSeries;
    this.addCustomTicks(totalLEDs);

    for (let i = 0; i < totalLEDs; i++) {
      const rect = series
        .add({
          height: 0,
          width: this.rectWidth,
          x: this.seriesGap * i,
          y: 0,
        })
        .setFillStyle(this.blueColor);

      this.rectangles.push(rect);
    }

    // Create the ambient
    const ambientRect = series
      .add({
        height: 0,
        width: this.rectWidth,
        x: this.seriesGap * totalLEDs,
        y: 0,
      })
      .setFillStyle(this.whiteColor);

    this.rectangles.push(ambientRect);
  }

  /**
   * Updates the X axis interval to fit all the rectangles.
   * @param totalLEDs
   */
  private addCustomTicks(totalLEDs: number) {
    const xAxis = this.chart?.getDefaultAxisX() as Axis;

    for (let i = 0; i < totalLEDs; i++) {
      const tick = xAxis
        .addCustomTick(UIElementBuilders.AxisTick)
        .setValue(this.seriesGap * i + this.rectWidth / 2)
        .setTextFormatter(() => 'LED' + (i + 1));

      this.customTicks.push(tick);
    }

    // Create the ambient
    const ambientTick = xAxis
      .addCustomTick(UIElementBuilders.AxisTick)
      .setValue(this.seriesGap * totalLEDs + 1 + this.rectWidth / 2)
      .setTextFormatter(() => 'Ambient');

    this.customTicks.push(ambientTick);
  }

  /**
   * Creates the LCJS chart instance.
   */
  private createChart(container: string) {
    this.chart = lightningChart()
      .ChartXY({
        container,
        disableAnimations: true,
        antialias: true,
        theme: spectrumTheme,
      })
      .setTitleMarginBottom(10)
      .setAutoCursorMode(AutoCursorModes.disabled)
      .setMouseInteractions(false);
  }

  /**
   * Creates the rectangle series for the chart.
   */
  private createRectangleSeries() {
    this.rectangleSeries = this.chart
      ?.addRectangleSeries()
      .setMouseInteractions(false)
      .setCursorEnabled(false) as RectangleSeries;
  }

  /**
   * Customizes the X and Y axis of the chart.
   */
  private customizeAxes() {
    const [xAxis, yAxis] = (this.chart as ChartType).getDefaultAxes();

    xAxis
      .setTitle('LEDs + Ambient')
      .setMouseInteractions(false)
      .setChartInteractions(false)
      .setScrollStrategy(AxisScrollStrategies.fitting)
      // Disable default ticks.
      .setTickStrategy(AxisTickStrategies.Empty);

    // Y Axis
    yAxis
      .setMouseInteractions(false)
      .setChartInteractions(false)
      .setScrollStrategy(AxisScrollStrategies.fitting)
      .setInterval(0, 15_000);

    yAxis.setTickStrategy(AxisTickStrategies.Numeric, (tick) =>
      tick
        .setMajorTickStyle((majorTick) =>
          majorTick
            .setLabelFont(uiMajorTickFont)
            .setLabelFillStyle(textFillStyle)
            .setGridStrokeStyle(
              new SolidLine({
                thickness: 0.5,
                fillStyle: new SolidFill({ color: ColorHEX('#222') }),
              }),
            ),
        )
        .setMinorTickStyle((minorTick: VisibleTicks) =>
          minorTick
            .setLabelFont(uiMinorTickFont)
            .setLabelFillStyle(textFillStyle)
            .setGridStrokeStyle(
              new SolidLine({
                thickness: 0.5,
                fillStyle: new SolidFill({ color: ColorHEX('#222') }),
              }),
            ),
        ),
    );
  }
}
