import lcjs, {
  ChartXY,
  ColorHEX,
  PointMarker,
  SolidLine,
  UIBackground,
  UIDraggingModes,
  VisibleTicks,
} from '@arction/lcjs';
import { devices } from '@electron/configs/devices';
import {
  spectrumTheme,
  uiMinorTickFont,
  uiMajorTickFont,
  textFillStyle,
} from './methods/ChartTheme';

const {
  lightningChart,
  AxisScrollStrategies,
  SolidFill,
  ColorRGBA,
  AutoCursorModes,
  AxisTickStrategies,
  UIElementBuilders,
} = lcjs;

class ProbeCalibrationChart {
  containerId: string;
  LEDs: string[];
  chart: undefined | ChartXY<PointMarker, UIBackground>;
  barChart: undefined;
  rectangleSeries: undefined | lcjs.RectangleSeries;
  redColor: lcjs.SolidFill;
  blueColor: lcjs.SolidFill;
  LEDRectangles: (lcjs.RectangleFigure | undefined)[] | undefined;
  PD_THRESHOLD_VALUE: number;
  UIElement: (lcjs.UITextBox<UIBackground> & lcjs.UIElement) | undefined;
  greenColor: lcjs.SolidFill;

  constructor(containerId: string) {
    this.LEDs = new Array(devices[0].LEDs).fill('LED');
    this.containerId = containerId;
    this.chart = undefined;
    this.rectangleSeries = undefined;
    this.redColor = new SolidFill().setColor(ColorRGBA(242, 67, 79));
    this.blueColor = new SolidFill().setColor(ColorRGBA(42, 171, 240));
    this.greenColor = new SolidFill().setColor(ColorRGBA(25, 255, 100));
    this.LEDRectangles = undefined;
    this.UIElement = undefined;
    this.PD_THRESHOLD_VALUE = 2000;
  }

  /**
   * Creates the chart used to test probe intensities
   */
  createProbeCalibrationChart() {
    this.chart = lightningChart()
      .ChartXY({
        container: this.containerId,
        disableAnimations: true,
        antialias: true,
        theme: spectrumTheme,
      })
      .setTitle('Probe Calibration')
      .setTitleMarginBottom(10)
      .setAutoCursorMode(AutoCursorModes.disabled)
      .setMouseInteractions(false);

    this.createRectangleSeries();
    this.customizeXAxis();
    this.customizeYAxis();
    this.LEDRectangles = this.addLEDRectangles();
    this.addUIElements();
  }

  /**
   * Customizes the x axis of the chart
   */
  customizeXAxis() {
    const axisX = this.chart?.getDefaultAxisX() as lcjs.Axis;

    axisX
      .setTitle('LEDs + Ambient')
      .setMouseInteractions(false)
      .setScrollStrategy(AxisScrollStrategies.fitting)

      // Disable default ticks.
      .setTickStrategy(AxisTickStrategies.Empty);
  }

  /**
   * Customizes the Y axis of the chart
   */
  customizeYAxis() {
    const axisY = this.chart?.getDefaultAxisY() as lcjs.Axis;
    axisY
      .setTitle('Raw PD Values (mV)')
      .setMouseInteractions(false)
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval(0, 4500, 300);

    axisY
      .addConstantLine(false)
      .setValue(this.PD_THRESHOLD_VALUE)
      .setMouseInteractions(false)
      .setStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX('#7f7f7f') }),
        })
      );

    axisY.setTickStrategy(AxisTickStrategies.Numeric, (tick) =>
      tick
        .setMajorTickStyle((majorTick) =>
          majorTick
            .setLabelFont(uiMajorTickFont)
            .setLabelFillStyle(textFillStyle)
            .setGridStrokeStyle(
              new SolidLine({
                thickness: 0.5,
                fillStyle: new SolidFill({ color: ColorHEX('#222') }),
              })
            )
        )
        .setMinorTickStyle((minorTick: VisibleTicks) =>
          minorTick
            .setLabelFont(uiMinorTickFont)
            .setLabelFillStyle(textFillStyle)
            .setGridStrokeStyle(
              new SolidLine({
                thickness: 0.5,
                fillStyle: new SolidFill({ color: ColorHEX('#222') }),
              })
            )
        )
    );
  }

  /**
   * Resets the data on the graph
   */
  resetData() {
    this.LEDRectangles &&
      this.LEDRectangles.forEach((_, i) => {
        this.LEDRectangles &&
          this.LEDRectangles[i]?.setDimensions({
            ...(this.LEDRectangles[
              i
            ]?.getDimensionsPositionAndSize() as lcjs.RectanglePositionAndSize),
            height: 0,
          });
      });
  }

  /**
   * Adds UI element to the chart
   */
  addUIElements() {
    this.UIElement = this.chart
      ?.addUIElement(UIElementBuilders.TextBox, {
        x: this.chart.getDefaultAxisX(),
        y: this.chart.getDefaultAxisY(),
      })
      .setDraggingMode(UIDraggingModes.notDraggable)
      .setPosition({
        x: 0.3,
        y: this.PD_THRESHOLD_VALUE - 135,
      })
      .setText('Threshold Value');
  }

  /**
   * Creates rectangle series for the chart
   */
  createRectangleSeries() {
    if (this.chart) this.rectangleSeries = this.chart.addRectangleSeries();
  }

  /**
   * Adds bar charts for each LED
   */
  addLEDRectangles() {
    const axisX = this.chart?.getDefaultAxisX() as lcjs.Axis;
    const width = 0.6;
    let count = 0;
    const LEDRectangles = this.LEDs.map((LED, i) => {
      const rectangle = this.rectangleSeries
        ?.add({
          x: count,
          y: 0,
          height: 0,
          width,
        })
        .setFillStyle(this.blueColor);

      axisX
        .addCustomTick(UIElementBuilders.AxisTick)

        .setValue(count + width / 2)
        .setTextFormatter(() => `${LED} ${i + 1}`)
        .setGridStrokeStyle(
          new SolidLine({
            thickness: 0.5,
            fillStyle: new SolidFill({ color: ColorHEX('#222') }),
          })
        );

      count += 1;
      return rectangle;
    });

    const ambient = this.rectangleSeries?.add({
      x: count,
      y: 0,
      height: 0,
      width,
    });

    axisX
      .addCustomTick(UIElementBuilders.AxisTick)
      .setValue(count + width / 2)
      .setTextFormatter(() => 'Ambient')
      .setGridStrokeStyle(
        new SolidLine({
          thickness: 0.5,
          fillStyle: new SolidFill({ color: ColorHEX('#222') }),
        })
      );

    LEDRectangles.push(ambient);

    return LEDRectangles;
  }

  /**
   * Listens for incoming device data
   */
  listenForData() {
    console.log('LISTENING');
    window.api.onIPCData('device:calibration', (_event, data: number[]) => {
      data.forEach((dataPoint, i) => {
        this.LEDRectangles &&
          this.LEDRectangles[i]?.setDimensions({
            ...(this.LEDRectangles[
              i
            ]?.getDimensionsPositionAndSize() as lcjs.RectanglePositionAndSize),
            height:
              i === data.length - 1 ? data[i] : data[i] - data[data.length - 1],
          });
        i !== data.length - 1 &&
          this.LEDRectangles &&
          this.LEDRectangles[i]?.setFillStyle(
            dataPoint > this.PD_THRESHOLD_VALUE ? this.blueColor : this.redColor
          );

        i === data.length - 1 &&
          this.LEDRectangles &&
          this.LEDRectangles[data.length - 1]?.setFillStyle(
            dataPoint > 350 ? this.redColor : this.greenColor
          );

        data[0] > this.PD_THRESHOLD_VALUE - 100
          ? this.UIElement?.dispose()
          : this.UIElement?.restore();
      });
    });
  }

  /**
   * Stops listening for data
   */
  stopListening() {
    window.api.removeListeners('probe-calibration-data');
  }

  /**
   * Cleanups the memory and disposes the chart
   */
  cleanup() {
    window.api.removeListeners('probe-calibration-data');
    this.chart?.dispose();
    this.rectangleSeries = undefined;
    this.chart = undefined;
  }
}

export default ProbeCalibrationChart;
