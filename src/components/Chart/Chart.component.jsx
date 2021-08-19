import React, { useEffect } from 'react';

// Extract required parts from LightningChartJS.

//Prepares and enders the chart
const Chart = () => {
  // const { lightningChart } = lcjs;

  // const channels = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4'];
  // const channelCount = channels.length;

  //For the div to load first so that Lightning chart can find the id.
  useEffect(() => {
    // Import LightningChartJS
    const lcjs = require('@arction/lcjs');

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
      SolidLine,
      ColorPalettes,
    } = lcjs;

    // Import data-generator from 'xydata'-library.
    const { createProgressiveTraceGenerator } = require('@arction/xydata');

    const channels = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4'];
    const channelCount = channels.length;

    // Create Dashboard.
    const dashboard = lightningChart().Dashboard({
      // theme: Themes.darkGold
      numberOfRows: 9,
      numberOfColumns: 1,
      container: 'chart',
    });

    let chartRowIndex = 2;
    // Map XY-charts to Dashboard for each channel.
    const charts = channels.map((channelName, i) => {
      const chart = dashboard.createChartXY({
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
      if (i !== channelCount - 1) {
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

    const zoomBandChart = charts.map(chart => {
      return dashboard.createZoomBandChart({
        columnIndex: 0,
        columnSpan: 1,
        rowIndex: 8,
        rowSpan: 1,
        axis: chart.getDefaultAxisX(),
      });
    });

    zoomBandChart.forEach(zoomBandChart => {
      zoomBandChart.setTitle('');
      zoomBandChart.setPadding(2);
      zoomBandChart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty);
      zoomBandChart.setTitleFillStyle(emptyFill);
    });

    // The bottom X Axis, which shows ticks for all stacked charts.
    const axisX = charts[charts.length - 1].getDefaultAxisX();

    const palette = ColorPalettes.flatUI(5);

    const selectedFillStyle = new SolidFill().setColor(palette(1));

    const lineChartColorArr = [];

    for (let i = 1; i <= 4; i++) {
      lineChartColorArr.push(new SolidFill().setColor(palette(i)));
    }

    // Add progressive line series to each chart.
    const seriesList = charts.map((chart, i) =>
      chart
        .addLineSeries({
          dataPattern: {
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
          },
        })
        .setStrokeStyle(style => style.setFillStyle(lineChartColorArr[i])),
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

    // Code for synchronizing all X Axis intervals in stacked XY charts.
    let isAxisXScaleChangeActive = false;
    const syncAxisXEventHandler = (axis, start, end) => {
      if (isAxisXScaleChangeActive) return;
      isAxisXScaleChangeActive = true;

      // Find all other X Axes.
      const otherAxes = charts.map(chart => chart.getDefaultAxisX()).filter(axis2 => axis2 !== axis);

      // Sync other X Axis intervals.
      otherAxes.forEach(axis => axis.setInterval(start, end, false, true));

      isAxisXScaleChangeActive = false;
    };

    // Create UI elements for custom cursor.
    const resultTable = dashboard
      .addUIElement(UILayoutBuilders.Column, dashboard.engine.scale)
      .setMouseInteractions(false)
      .setOrigin(UIOrigins.LeftBottom)
      .setMargin(5)
      .setBackground(background =>
        background
          // Style same as Theme result table.
          .setFillStyle(dashboard.getTheme().resultTableFillStyle)
          .setStrokeStyle(dashboard.getTheme().resultTableStrokeStyle),
      );

    const resultTableTextBuilder = UIElementBuilders.TextBox
      // Style same as Theme result table text.
      .addStyler(textBox => textBox.setTextFillStyle(dashboard.getTheme().resultTableTextFillStyle));

    const rowX = resultTable.addElement(UILayoutBuilders.Row).addElement(resultTableTextBuilder);

    const rowsY = seriesList.map((el, i) => {
      return resultTable.addElement(UILayoutBuilders.Row).addElement(resultTableTextBuilder);
    });

    const tickX = charts[channelCount - 1].getDefaultAxisX().addCustomTick();

    const ticksX = [];
    charts.forEach((chart, i) => {
      if (i !== channelCount - 1) {
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

    const ticksY = seriesList.map((el, i) => {
      return charts[i].getDefaultAxisY().addCustomTick();
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
    charts.forEach((chart, i) => {
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
        const nearestDataPoints = seriesList.map(el => el.solveNearestFromScreen(mouseLocationEngine));

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
          seriesList[i].scale,
          // Target coordinate system.
          dashboard.engine.scale,
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
        rowX.setText(`X: ${axisX.formatValue(nearestDataPoints[i].location.x)}`);
        rowsY.forEach((rowY, i) => {
          rowY.setText(`Y${i}: ${charts[i].getDefaultAxisY().formatValue(nearestDataPoints[i].location.y)}`);
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
      axis.onScaleChange((start, end) => syncAxisXEventHandler(axis, start, end));

      // hide custom cursor and ticks if mouse leaves chart area
      chart.onSeriesBackgroundMouseLeave((_, e) => {
        setCustomCursorVisible(false);
      });

      // hide custom cursor and ticks on Drag
      chart.onSeriesBackgroundMouseDragStart((_, e) => {
        setCustomCursorVisible(false);
      });
    });
  }, []);
  return <div className="fit-to-container" id="chart"></div>;
};

export default Chart;
