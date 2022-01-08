import {
  UILayoutBuilders,
  UIOrigins,
  UIElementBuilders,
  Axis,
  translatePoint,
} from '@arction/lcjs';
import msToTime from '@utils/msToTime';
import ChartClass from '../Chart';

function customCursor(this: ChartClass) {
  const dashboard = this.dashboard;
  const charts = this.charts;
  const series = this.series;
  // Create UI elements for custom cursor.
  const resultTable = dashboard
    .addUIElement(UILayoutBuilders.Column, dashboard.engine.scale)
    .setMouseInteractions(false)
    .setOrigin(UIOrigins.LeftBottom)
    .setMargin(5)
    .setBackground((background: any) =>
      background
        // Style same as Theme result table.
        .setFillStyle(dashboard.getTheme().resultTableFillStyle)
        .setStrokeStyle(dashboard.getTheme().resultTableStrokeStyle)
    );

  const resultTableTextBuilder = UIElementBuilders.TextBox
    // Style same as Theme result table text.
    .addStyler((textBox) =>
      textBox.setTextFillStyle(dashboard.getTheme().resultTableTextFillStyle)
    );

  const rowX = resultTable
    .addElement(UILayoutBuilders.Row)
    .addElement(resultTableTextBuilder);

  const rowsY = series.map(() => {
    return resultTable
      .addElement(UILayoutBuilders.Row)
      .addElement(resultTableTextBuilder);
  });

  const tickX = (this.xAxisChart?.getDefaultAxisX() as Axis).addCustomTick();

  const ticksX: any[] = [];
  charts.forEach((chart: any, i: any) => {
    if (i !== charts.length) {
      ticksX.push(
        chart
          .getDefaultAxisX()
          .addConstantLine()
          .setValue(0)
          .setMouseInteractions(false)
          // Style according to Theme custom tick grid stroke.
          .setStrokeStyle(chart.getTheme().customTickGridStrokeStyle)
      );
    }
  });

  const ticksY = series.map((_el: any, i: number) => {
    return charts[i].getDefaultAxisY().addCustomTick();
  });

  const setCustomCursorVisible = (visible: any) => {
    if (!visible) {
      resultTable.dispose();
      tickX.dispose();
      ticksY.forEach((el: any) => el.dispose());
      ticksX.forEach((el) => el.dispose());
    } else {
      resultTable.restore();
      tickX.restore();
      ticksY.forEach((el: any) => el.restore());
      ticksX.forEach((el) => el.restore());
    }
  };

  // Hide custom cursor components initially.
  setCustomCursorVisible(false);

  // Implement custom cursor logic with events.
  charts.forEach((chart: any, i: number) => {
    const AxisX = chart.getDefaultAxisX();

    // The bottom X Axis, which shows ticks for all stacked charts.
    const axisX = charts[charts.length - 1].getDefaultAxisX();

    chart.onSeriesBackgroundMouseMove((_: any, event: any) => {
      // mouse location in web page
      const mouseLocationClient = {
        x: event.clientX,
        y: event.clientY,
      };
      // Translate mouse location to LCJS coordinate system for solving data points from series, and translating to Axes.
      const mouseLocationEngine = chart.engine.clientLocation2Engine(
        mouseLocationClient.x,
        mouseLocationClient.y
      );

      // Find the nearest data point to the mouse.
      const nearestDataPoints = series.map((el: any) =>
        el.solveNearestFromScreen(mouseLocationEngine)
      );

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
        series[i].scale,
        // Target coordinate system.
        dashboard.engine.scale
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
      rowX.setText(
        `Time: ${msToTime(
          parseFloat(axisX.formatValue(nearestDataPoints[i].location.x))
        )}`
      );
      rowsY.forEach((rowY: any, i: number) => {
        rowY.setText(
          `${this.channels[i]}: ${charts[i]
            .getDefaultAxisY()
            .formatValue(nearestDataPoints[i].location.y)}`
        );
      });

      // Position custom ticks.
      tickX.setValue(nearestDataPoints[i].location.x);
      ticksX.forEach((tick) => {
        tick.setValue(tickX.getValue());
      });
      ticksY.forEach((tick: any, i: number) => {
        tick.setValue(nearestDataPoints[i].location.y);
      });

      // Display cursor.
      setCustomCursorVisible(true);
    });

    // hide custom cursor and ticks if mouse leaves chart area
    chart.onSeriesBackgroundMouseLeave(() => {
      setCustomCursorVisible(false);
    });

    // hide custom cursor and ticks on Drag
    chart.onSeriesBackgroundMouseDragStart(() => {
      setCustomCursorVisible(false);
    });
  });
}

export default customCursor;
