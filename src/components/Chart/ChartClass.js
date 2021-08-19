/**
 * Lightning chart UI render and settings
 */

// Import LightningChartJS
import lcjs from '@arction/lcjs';
const { createProgressiveTraceGenerator } = require('@arction/xydata');

// Extract required parts from LightningChartJS.
const {
  lightningChart,
  emptyFill,
  emptyLine,
  AxisTickStrategies,
  AutoCursorModes,
  SolidFill,
  ColorRGBA,
  translatePoint,
  UILayoutBuilders,
  UIElementBuilders,
  UIOrigins,
  Themes,
  ColorHEX,
} = lcjs;

export default class ChartClass {
  constructor(channelCount = 4, zoomBandActive = true) {
    this.channelCount = channelCount;
    this.zoomBandActive = zoomBandActive;
    this.numberOfRows = channelCount * 2 + 1;

    this.generateChart();
  }

  generateChart() {
    //Dynamic Variables
    this.channels = this.createChannels();
    this.dashboard = this.createLightningChartDashboard();
    this.charts = this.createChartForEachChannel();
    this.zoomBandChart = this.createZoomBand();
    this.changeZoomBandStyle();
    this.seriesList = this.createDataPoint();
    this.syncAxisXEventHandler = this.synchronizeXAxis();
    this.createUIElement();
  }

  /**
   * Creates a chart dashboard from lightning chart
   */
  createLightningChartDashboard() {
    // Create Dashboard.
    const dashboard = lightningChart().Dashboard({
      // theme: Themes.darkGold
      numberOfRows: this.numberOfRows, //2 for each channel and one for the zoomBand
      numberOfColumns: 1,
      container: 'chart',
    });
    return dashboard;
  }

  /**
   * Creates an array based on the channelsCount
   * @returns channels array
   */
  createChannels() {
    const channels = [];
    for (let i = 1; i <= this.channelCount; i++) {
      channels.push(`Channel ${i}`);
    }
    return channels;
  }

  /**
   * Create chart for each channel
   */
  createChartForEachChannel() {
    let chartRowIndex = 2;
    // Map XY-charts to Dashboard for each channel.
    const charts = this.channels.map((channelName, i) => {
      const chart = this.dashboard.createChartXY({
        theme: Themes.dark,
        columnIndex: 0,
        rowIndex: i === 0 ? 0 : chartRowIndex,
        columnSpan: 1,
        rowSpan: 2,
      });
      // Disable default auto cursor.
      chart.setAutoCursorMode(AutoCursorModes.disabled);

      if (i === 0) {
        chart.setTitle('Sensor Data');
      } else {
        chart.setTitleFillStyle(emptyFill);
        //Add to chartRowIndex for channels other than 1 so that they all be the same size
        chartRowIndex += 2;
      }

      // Only display X ticks for bottom chart.
      if (i !== this.channelCount - 1) {
        chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty);
      }

      // Sync X axes of stacked charts by adding an invisible tick to each Y axis with preset length.
      chart
        .getDefaultAxisY()
        .addCustomTick(UIElementBuilders.AxisTick)
        // Preset length is configured with tick length property.
        .setTickLength(50)
        // Following code makes the tick invisible.
        .setTextFormatter(() => '')
        .setGridStrokeStyle(emptyLine)
        .setMarker(marker =>
          marker.setTickStyle(
            new SolidFill({
              color: ColorRGBA(0, 0, 0, 0),
            }),
          ),
        );
      return chart;
    });
    return charts;
  }

  /**
   * Creates a zoom band based on each channel
   */
  createZoomBand() {
    const zoomBandChart = this.charts.map(chart => {
      return this.dashboard.createZoomBandChart({
        columnIndex: 0,
        columnSpan: 1,
        rowIndex: 8,
        rowSpan: 1,
        axis: chart.getDefaultAxisX(),
      });
    });
    return zoomBandChart;
  }

  /**
   * Changes the default style of the zoom band
   */
  changeZoomBandStyle() {
    this.zoomBandChart.forEach(zoomBandChart => {
      zoomBandChart.setTitle('');
      zoomBandChart.setPadding(2);
      zoomBandChart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty);
      zoomBandChart.setTitleFillStyle(emptyFill);
    });
  }

  /**
   * Generates random data point for each channel
   */
  createDataPoint() {
    const lineChartColorArr = ['#E3170A', '#ABFF4F', '#00FFFF', '#FFFFFF'];

    // Add progressive line series to each chart.
    const seriesList = this.charts.map((chart, i) =>
      chart
        .addLineSeries({
          dataPattern: {
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
          },
        })
        .setName('test')
        .setStrokeStyle(style =>
          style.setFillStyle(
            new SolidFill({
              color: ColorHEX(lineChartColorArr[i]),
            }),
          ),
        ),
    );

    // Generate and push data to each line series.
    seriesList.forEach((series, i) =>
      createProgressiveTraceGenerator()
        .setNumberOfPoints(100 * 1000)
        .generate()
        .toPromise()
        .then(data => {
          series.add(data);
        }),
    );
    return seriesList;
  }

  /**
   * Synchronizes all X axis intervals in stacked XY charts
   */
  synchronizeXAxis() {
    let isAxisXScaleChangeActive = false;
    const syncAxisXEventHandler = (axis, start, end) => {
      if (isAxisXScaleChangeActive) return;
      isAxisXScaleChangeActive = true;

      // Find all other X Axes.
      const otherAxes = this.charts.map(chart => chart.getDefaultAxisX()).filter(axis2 => axis2 !== axis);

      // Sync other X Axis intervals.
      otherAxes.forEach(axis => axis.setInterval(start, end, false, true));

      isAxisXScaleChangeActive = false;
    };

    return syncAxisXEventHandler;
  }

  /**
   * Create UI Element for custom cursor
   */
  createUIElement() {
    const resultTable = this.dashboard
      .addUIElement(UILayoutBuilders.Column, this.dashboard.engine.scale)
      .setMouseInteractions(false)
      .setOrigin(UIOrigins.LeftBottom)
      .setMargin(5)
      .setBackground(background =>
        background
          // Style same as Theme result table.
          .setFillStyle(this.dashboard.getTheme().resultTableFillStyle)
          .setStrokeStyle(this.dashboard.getTheme().resultTableStrokeStyle),
      );

    const resultTableTextBuilder = UIElementBuilders.TextBox
      // Style same as Theme result table text.
      .addStyler(textBox => textBox.setTextFillStyle(this.dashboard.getTheme().resultTableTextFillStyle));

    const rowX = resultTable.addElement(UILayoutBuilders.Row).addElement(resultTableTextBuilder);

    const rowsY = this.seriesList.map((el, i) => {
      return resultTable.addElement(UILayoutBuilders.Row).addElement(resultTableTextBuilder);
    });

    const tickX = this.charts[this.channelCount - 1].getDefaultAxisX().addCustomTick();

    const ticksX = [];
    this.charts.forEach((chart, i) => {
      if (i !== this.channelCount - 1) {
        ticksX.push(
          chart
            .getDefaultAxisX()
            .addConstantLine()
            .setValue(0)
            .setMouseInteractions(false)
            // Style according to Theme custom tick grid stroke.
            .setStrokeStyle(chart.getTheme().customTickGridStrokeStyle),
        );
      }
    });

    const ticksY = this.seriesList.map((el, i) => {
      return this.charts[i].getDefaultAxisY().addCustomTick();
    });

    const setCustomCursorVisible = visible => {
      if (!visible) {
        resultTable.dispose();
        tickX.dispose();
        ticksY.forEach(el => el.dispose());
        ticksX.forEach(el => el.dispose());
      } else {
        resultTable.restore();
        tickX.restore();
        ticksY.forEach(el => el.restore());
        ticksX.forEach(el => el.restore());
      }
    };
    // Hide custom cursor components initially.
    setCustomCursorVisible(false);

    // Implement custom cursor logic with events.
    this.charts.forEach((chart, i) => {
      const AxisX = chart.getDefaultAxisX();

      chart.onSeriesBackgroundMouseMove((_, event) => {
        // mouse location in web page
        const mouseLocationClient = {
          x: event.clientX,
          y: event.clientY,
        };
        // Translate mouse location to LCJS coordinate system for solving data points from series, and translating to Axes.
        const mouseLocationEngine = chart.engine.clientLocation2Engine(
          mouseLocationClient.x,
          mouseLocationClient.y,
        );

        // Find the nearest data point to the mouse.
        const nearestDataPoints = this.seriesList.map(el => el.solveNearestFromScreen(mouseLocationEngine));

        // Abort operation if any of solved data points is `undefined`.
        if (nearestDataPoints.includes(undefined)) {
          setCustomCursorVisible(false);
          return;
        }

        // location of nearest point of current chart
        const nearestPointLocation = nearestDataPoints[i].location;

        // Translate mouse location to dashboard scale.
        const mouseLocationAxis = translatePoint(
          nearestPointLocation,
          // Source coordinate system.
          this.seriesList[i].scale,
          // Target coordinate system.
          this.dashboard.engine.scale,
        );

        // Set custom cursor location.
        resultTable.setPosition({
          x: mouseLocationAxis.x,
          y: mouseLocationEngine.y,
        });

        // Change origin of result table based on cursor location.
        if (nearestPointLocation.x > AxisX.getInterval().end / 1.5) {
          resultTable.setOrigin(UIOrigins.RightBottom);
        } else {
          resultTable.setOrigin(UIOrigins.LeftBottom);
        }

        // Format result table text.
        rowX.setText(`X: ${AxisX.formatValue(nearestDataPoints[i].location.x)}`);
        rowsY.forEach((rowY, i) => {
          rowY.setText(
            `Y${i}: ${this.charts[i].getDefaultAxisY().formatValue(nearestDataPoints[i].location.y)}`,
          );
        });

        // Position custom ticks.
        tickX.setValue(nearestDataPoints[i].location.x);
        ticksX.forEach((tick, i) => {
          tick.setValue(tickX.getValue());
        });
        ticksY.forEach((tick, i) => {
          tick.setValue(nearestDataPoints[i].location.y);
        });

        // Display cursor.
        setCustomCursorVisible(true);
      });

      // sync all the axes
      const axis = chart.getDefaultAxisX();
      axis.onScaleChange((start, end) => this.syncAxisXEventHandler(axis, start, end));

      // hide custom cursor and ticks if mouse leaves chart area
      chart.onSeriesBackgroundMouseLeave((_, e) => {
        setCustomCursorVisible(false);
      });

      // hide custom cursor and ticks on Drag
      chart.onSeriesBackgroundMouseDragStart((_, e) => {
        setCustomCursorVisible(false);
      });
    });
  }
}
