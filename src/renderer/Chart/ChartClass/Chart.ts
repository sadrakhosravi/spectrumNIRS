// Import LCJS
import {
  lightningChart,
  SolidFill,
  ColorHEX,
  AutoCursorModes,
  AxisScrollStrategies,
  AxisTickStrategies,
  emptyFill,
  SolidLine,
  synchronizeAxisIntervals,
  translatePoint,
  UIElementBuilders,
  UILayoutBuilders,
  UIOrigins,
  emptyLine,
  Themes,
  Dashboard,
  ChartXY,
  PointMarker,
  UIBackground,
  LineSeries,
  VisibleTicks,
} from '@arction/lcjs';
// import ChartOptions from './ChartOptions';
// Import data-generators from 'xydata'-library.

// Constants
import { ChartType } from 'utils/constants';

class ChartClass {
  channelCount: number;
  seriesLineColorArr: string[];
  dashboard: any;
  charts: any;
  Series: any;
  // ChartSyncXAxis: any;
  seriesLength: any;
  type: string;
  channels: string[];
  series: any;
  samplingRate: number;
  TOILegend: any;
  containerId: string;
  ChartOptions: any;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    this.channels = channels || ['No Channel'];
    this.channelCount = channels.length;
    this.type = type;
    this.samplingRate = samplingRate;
    this.containerId = containerId;
    this.seriesLineColorArr = ['#E3170A', '#00FFFF', '#ABFF4F', '#FFFFFF']; //Colors for each series: ['red','yellow','cyan', 'white']
    this.TOILegend = null;
    this.ChartOptions = null;
  }

  // Chart dashboard
  createDashboard(numberOfRows: number, container: string): Dashboard {
    const dashboard = lightningChart().Dashboard({
      numberOfRows, //Total number of rows for the dashboard - default 8
      numberOfColumns: 2, //Full width
      container, //div id to attach to
      antialias: true,
      theme: Themes.darkGold,
    });
    dashboard.setBackgroundFillStyle(
      new SolidFill({
        color: ColorHEX('#0d0c0c'),
      })
    );
    dashboard.setColumnWidth(0, 1);
    dashboard.setColumnWidth(1, 11);
    return dashboard;
  }

  // Create chart per each channel
  createChartPerChannel(channels: string[], dashboard: Dashboard) {
    // Create an array containing all the charts that is being created
    const charts = channels.map((_channel, i) => {
      const chart = dashboard
        .createChartXY({
          rowIndex: i,
          columnIndex: 1,
        })
        .setPadding({ bottom: 10, top: 10, right: 10 });
      return chart;
    });
    return charts;
  }

  // Create series for each chart
  createSeriesForEachChart(
    charts: ChartXY<PointMarker, UIBackground>[]
  ): LineSeries[] {
    // Create a series array containing all the series created based on each chart
    const series = charts.map((chart, i) => {
      return chart
        .addLineSeries({
          dataPattern: {
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
            // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
            regularProgressiveStep: false,
          },
        })
        .setDataCleaning({ minDataPointCount: 1 }) // Enable data cleaning by default
        .setStrokeStyle(
          new SolidLine({
            thickness: 2,
            fillStyle: new SolidFill({
              color: ColorHEX(this.seriesLineColorArr[i]),
            }),
          })
        );
    });
    return series;
  }

  // Remove unused elements from each chart
  customizeChart(charts: ChartXY<PointMarker, UIBackground>[]) {
    charts.forEach((chart, i) => {
      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();

      // Set the Y axis to be fitting to the data
      axisY.setScrollStrategy(AxisScrollStrategies.fitting);

      // Set Interval to 30s
      axisX.setInterval(0, 30000);

      // Remove X Axis on all charts except the last one
      if (i !== charts.length - 1) {
        axisX
          .setTickStrategy(AxisTickStrategies.Time, (ticks) =>
            ticks
              .setMajorTickStyle((majorTicks) =>
                majorTicks
                  .setLabelFillStyle(emptyFill)
                  .setTickStyle(emptyLine)
                  .setTickLength(0)
                  .setTickPadding(0)
              )
              .setMinorTickStyle((minorTicks: VisibleTicks) =>
                minorTicks
                  .setLabelFillStyle(emptyFill)
                  .setTickStyle(emptyLine)
                  .setTickLength(0)
                  .setTickPadding(0)
              )
          )
          .setStrokeStyle(emptyLine)
          .setScrollStrategy(AxisScrollStrategies.progressive)
          .setTickStrategy(AxisTickStrategies.Empty)
          .setStrokeStyle(emptyLine);
      } else {
        axisX
          .setTickStrategy(AxisTickStrategies.Time, (ticks) =>
            ticks
              .setMajorTickStyle((majorTickStyle) =>
                majorTickStyle.setGridStrokeStyle(emptyLine)
              )
              .setMinorTickStyle((minorTickStyle: any) =>
                minorTickStyle.setGridStrokeStyle(emptyLine)
              )
          )

          .setTitle('Time (hh:mm:ss)')
          .setScrollStrategy(AxisScrollStrategies.progressive);
      }
      // Remove all chart titles
      if (i === 0) {
        chart.setTitle('Sensor Data');
      } else {
        chart.setTitleFillStyle(emptyFill);
      }

      // Align Y axes of stacked charts.
      chart.getDefaultAxisY().setThickness(50);

      // Disable default auto cursor.
      chart.setAutoCursorMode(AutoCursorModes.disabled);
    });
  }

  uiList(charts: ChartXY<PointMarker, UIBackground>[], dashboard: Dashboard) {
    charts.forEach((chart, i) => {
      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();
      const panel = dashboard.createUIPanel({
        columnIndex: 0,
        rowIndex: i,
      });

      const legendLayout = panel
        .addUIElement(UILayoutBuilders.Column)
        .setPosition(
          translatePoint(
            {
              x: 0,
              y: axisY.getInterval().end,
            },
            { x: axisX, y: axisY },
            chart.uiScale
          )
        )
        .setOrigin(UIOrigins.LeftTop)
        .setMouseInteractions(false)
        .setBackground((bg: any) =>
          bg.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
        );

      if (this.channels[i] === 'TOI') {
        legendLayout
          .addElement(UIElementBuilders.TextBox)
          .setMargin({ top: 15 })
          .setText(this.channels[i])
          .setTextFont((font: any) => font.setSize(16));

        this.TOILegend = legendLayout
          .addElement(UIElementBuilders.TextBox)
          .setText('-')
          .setMargin({ top: 5, bottom: 0 })
          .setTextFont((font: any) => font.setSize(24));
      } else {
        legendLayout
          .addElement(UIElementBuilders.TextBox)
          .setText(this.channels[i])
          .setMargin({ top: 15 })
          .setTextFont((font: any) => font.setSize(16));
      }

      legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(' ')
        .setMargin({ top: 5 })
        .setBackground((background: any) =>
          background.setFillStyle(
            new SolidFill({
              color: ColorHEX(this.seriesLineColorArr[i]),
            })
          )
        );

      legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(this.samplingRate.toString() + ' samples/s')
        .setTextFont((font: any) => font.setSize(9))
        .setMargin({ top: 10 });
    });
  }

  // Synchronizes all X axis to have the same interval/move at the same time
  synchronizeXAxis(charts: ChartXY<PointMarker, UIBackground>[]) {
    const syncedAxes = charts.map((chart) => chart.getDefaultAxisX());
    synchronizeAxisIntervals(...syncedAxes);
  }

  // Custom cursor logic that is synchronized between all charts
  customCursor(
    dashboard: Dashboard,
    charts: ChartXY<PointMarker, UIBackground>[],
    series: LineSeries[]
  ) {
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

    const tickX = charts[charts.length - 1].getDefaultAxisX().addCustomTick();

    const ticksX: any[] = [];
    charts.forEach((chart: any, i: any) => {
      if (i !== charts.length - 1) {
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
          `Time: ${axisX.formatValue(nearestDataPoints[i].location.x)}`
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
}

export default ChartClass;
