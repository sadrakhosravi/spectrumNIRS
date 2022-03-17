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
import { DeviceDataType } from '@electron/models/DeviceReader/DeviceDataTypes';
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
  private containerId: string;
  private LEDs: string[];
  private chart: undefined | ChartXY<PointMarker, UIBackground>;
  private rectangleSeries: undefined | lcjs.RectangleSeries;
  private redColor: lcjs.SolidFill;
  private blueColor: lcjs.SolidFill;
  private LEDRectangles: lcjs.RectangleFigure[] | undefined;
  private ADCThresholdValue: number;
  private UIElement:
    | (lcjs.UITextBox<UIBackground> & lcjs.UIElement)
    | undefined;
  private greenColor: lcjs.SolidFill;
  private ambientThreshold: number;

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
    this.ADCThresholdValue = 2000;
    this.ambientThreshold = 500;
  }

  /**
   * Creates the chart used to test probe intensities
   */
  public createProbeCalibrationChart() {
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
   * Listens for incoming device data
   */
  public listenForData() {
    console.log('LISTENING');
    window.api.onIPCData(
      'device:calibration',
      (_event, data: DeviceDataType) => {
        const LEDRectangles = this.LEDRectangles as lcjs.RectangleFigure[];
        const ambientPos = data['ADC1'].length - 1;
        const ambient = data['ADC1'][ambientPos];

        const ambientRect = LEDRectangles[ambientPos];

        // Add all wavelengths on the chart except ambient
        for (let i = 0; i < data['ADC1'].length - 1; i += 1) {
          const LEDRectangleDimensions =
            LEDRectangles[i].getDimensionsPositionAndSize();
          const height = data['ADC1'][i] - ambient;

          LEDRectangles[i].setDimensions({ ...LEDRectangleDimensions, height });

          // Check the value and assign the color accordingly
          if (height > this.ADCThresholdValue) {
            this.setRectangleColor(LEDRectangles[i], this.blueColor);
          } else {
            this.setRectangleColor(LEDRectangles[i], this.redColor);
          }
        }

        // Add ambient on the chart
        const ambientDims = ambientRect.getDimensionsPositionAndSize();
        ambientRect.setDimensions({
          ...ambientDims,
          height: ambient,
        });

        // Check the value and assign the color accordingly
        if (ambient > this.ambientThreshold) {
          this.setRectangleColor(ambientRect, this.redColor);
        } else {
          this.setRectangleColor(ambientRect, this.greenColor);
        }

        // Remove threshold element when LED 1 goes over it
        data['ADC1'][0] - ambient + 200 > this.ADCThresholdValue
          ? this.UIElement?.dispose()
          : this.UIElement?.restore();
      }
    );
  }

  /**
   * Stops listening for data
   */
  public stopListening() {
    window.api.removeListeners('device:calibration');
  }

  /**
   * Cleanups the memory and disposes the chart
   */
  public cleanup() {
    window.api.removeListeners('device:calibration');
    this.chart?.dispose();
    this.rectangleSeries = undefined;
    this.chart = undefined;
  }

  /**
   * Customizes the x axis of the chart
   */
  private customizeXAxis() {
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
  private customizeYAxis() {
    const axisY = this.chart?.getDefaultAxisY() as lcjs.Axis;
    axisY
      .setTitle('Raw PD Values (mV)')
      .setMouseInteractions(false)
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval(0, 4500, 300);

    axisY
      .addConstantLine(false)
      .setValue(this.ADCThresholdValue)
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
  public resetData() {
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
  private addUIElements() {
    this.UIElement = this.chart
      ?.addUIElement(UIElementBuilders.TextBox, {
        x: this.chart.getDefaultAxisX(),
        y: this.chart.getDefaultAxisY(),
      })
      .setDraggingMode(UIDraggingModes.notDraggable)
      .setPosition({
        x: 0.3,
        y: this.ADCThresholdValue - 135,
      })
      .setText('Threshold Value');
  }

  /**
   * Creates rectangle series for the chart
   */
  private createRectangleSeries() {
    if (this.chart) this.rectangleSeries = this.chart.addRectangleSeries();
  }

  /**
   * Adds bar charts for each LED
   */
  private addLEDRectangles() {
    const axisX = this.chart?.getDefaultAxisX() as lcjs.Axis;
    const width = 0.6;
    let count = 0;
    const LEDRectangles = this.LEDs.map((LED, i) => {
      const rectangle = (this.rectangleSeries as lcjs.RectangleSeries)
        .add({
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

    const ambient = (this.rectangleSeries as lcjs.RectangleSeries).add({
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
   * Changes the color of the given rectangle series by the given color
   * @param Rectangle the rectangle figure
   * @param color lcjs solid fill color
   */
  private setRectangleColor(
    Rectangle: lcjs.RectangleFigure,
    color: lcjs.SolidFill
  ) {
    Rectangle.setFillStyle(color);
  }
}

export default ProbeCalibrationChart;
