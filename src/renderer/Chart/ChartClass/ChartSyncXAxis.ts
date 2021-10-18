/**
 * Synchronize X axis and create a custom synced cursor
 */

// Import LightningChartJS
import lcjs from '@arction/lcjs';

const { translatePoint, UILayoutBuilders, UIElementBuilders, UIOrigins } = lcjs;

class ChartSyncXAxis {
  dashboard: any;
  charts: any;
  seriesList: any;
  channelCount: number;
  syncAxisXEventHandler: any;

  constructor(
    dashboard: any,
    charts: any,
    seriesList: any,
    channelCount: number
  ) {
    this.dashboard = dashboard;
    this.charts = charts;
    this.seriesList = seriesList;
    this.channelCount = channelCount;

    this.syncAxisXEventHandler = this.synchronizeXAxis();
    this.createUIElement();
  }

  /**
   * Synchronizes all X axis intervals in stacked XY charts
   */
  synchronizeXAxis() {
    let isAxisXScaleChangeActive = false;
    const syncAxisXEventHandler = (axis: any, start: any, end: any) => {
      if (isAxisXScaleChangeActive) return;
      isAxisXScaleChangeActive = true;

      // Find all other X Axes.
      const otherAxes = this.charts
        .map((chart: any) => chart.getDefaultAxisX())
        .filter((axis2: any) => axis2 !== axis);

      // Sync other X Axis intervals.
      otherAxes.forEach(
        (axis: {
          setInterval: (
            arg0: any,
            arg1: any,
            arg2: boolean,
            arg3: boolean
          ) => any;
        }) => axis.setInterval(start, end, false, true)
      );

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
      .setBackground((background: any) =>
        background
          // Style same as Theme result table.
          .setFillStyle(this.dashboard.getTheme().resultTableFillStyle)
          .setStrokeStyle(this.dashboard.getTheme().resultTableStrokeStyle)
      );

    const resultTableTextBuilder = UIElementBuilders.TextBox
      // Style same as Theme result table text.
      .addStyler((textBox: any) =>
        textBox.setTextFillStyle(
          this.dashboard.getTheme().resultTableTextFillStyle
        )
      );

    const rowX = resultTable
      .addElement(UILayoutBuilders.Row)
      .addElement(resultTableTextBuilder);

    const rowsY = this.seriesList.map(() => {
      return resultTable
        .addElement(UILayoutBuilders.Row)
        .addElement(resultTableTextBuilder);
    });

    const tickX = this.charts[this.channelCount - 1]
      .getDefaultAxisX()
      .addCustomTick();

    const ticksX: any[] = [];
    this.charts.forEach((chart: any, i: number) => {
      if (i !== this.channelCount - 1) {
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

    const ticksY = this.seriesList.map((_el: any, i: number) => {
      return this.charts[i].getDefaultAxisY().addCustomTick();
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
    this.charts.forEach((chart: any, i: number) => {
      const AxisX = chart.getDefaultAxisX();

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
        const nearestDataPoints = this.seriesList.map((el: any) =>
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
          this.seriesList[i].scale,
          // Target coordinate system.
          this.dashboard.engine.scale
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
          `X: ${AxisX.formatValue(nearestDataPoints[i].location.x)}`
        );
        rowsY.forEach((rowY: any, i: number) => {
          rowY.setText(
            `Y${i}: ${this.charts[i]
              .getDefaultAxisY()
              .formatValue(nearestDataPoints[i].location.y)}`
          );
        });

        // Position custom ticks.
        tickX.setValue(nearestDataPoints[i].location.x);
        ticksX.forEach((tick, _i) => {
          tick.setValue(tickX.getValue());
        });
        ticksY.forEach((tick: any, i: number) => {
          tick.setValue(nearestDataPoints[i].location.y);
        });

        // Display cursor.
        setCustomCursorVisible(true);
      });

      // sync all the axes
      const axis = chart.getDefaultAxisX();
      axis.onScaleChange((start: any, end: any) =>
        this.syncAxisXEventHandler(axis, start, end)
      );

      // hide custom cursor and ticks if mouse leaves chart area
      chart.onSeriesBackgroundMouseLeave((_: any, _e: any) => {
        setCustomCursorVisible(false);
      });

      // hide custom cursor and ticks on Drag
      chart.onSeriesBackgroundMouseDragStart((_: any, _e: any) => {
        setCustomCursorVisible(false);
      });
    });
  }
}

export default ChartSyncXAxis;
