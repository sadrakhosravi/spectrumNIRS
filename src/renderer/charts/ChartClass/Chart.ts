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
  customTheme,
  FontSettings,
  emptyTick,
  UIPanel,
  Axis,
  VisibleTicks,
} from '@arction/lcjs';

import msToTime from '@utils/msToTime';
// Constants
import { ChartType } from 'utils/constants';

const seriesFillStyle = new SolidFill({
  color: ColorHEX('#0a0a0a'),
});

const darkFillStyle = new SolidFill({
  color: ColorHEX('#222'),
});

export const textFillStyle = new SolidFill({
  color: ColorHEX('#fff'),
});

const titleFillStyle = new SolidFill({
  color: ColorHEX('#7f7f7f'),
});

const axisStyle = new SolidLine({
  thickness: 1,
  fillStyle: new SolidFill({ color: ColorHEX('#525252') }),
});

const fontStyle = new FontSettings({
  size: 14,
  family: 'Inter, Arial, sans-serif',
});

export const spectrumTheme = customTheme(Themes.darkGold, {
  panelBackgroundFillStyle: seriesFillStyle,
  seriesBackgroundFillStyle: seriesFillStyle,
  uiTextFillStyle: textFillStyle,
  axisTitleFillStyle: textFillStyle,
  chartTitleFillStyle: titleFillStyle,
  axisStyle: axisStyle,
  uiTickStrokeStyle: axisStyle,
  uiBackgroundStrokeStyle: emptyLine,
  lcjsBackgroundStrokeStyle: emptyLine,
  panelBackgroundStrokeStyle: emptyLine,
  uiTickTextFillStyle: titleFillStyle,
  customTickGridStrokeStyle: axisStyle,
  uiFont: fontStyle,
  uiPointableTextBoxFillStyle: darkFillStyle,
  uiPointableTextBoxStrokeStyle: emptyLine,
});

export const uiMinorTickFont = new FontSettings({
  size: 10,
  family: 'Inter, Arial, sans-serif',
  style: 'normal',
});

export const uiMajorTickFont = new FontSettings({
  size: 12,
  family: 'Inter, Arial, sans-serif',
  style: 'normal',
});

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
  UIPanel: null | UIPanel;
  xAxisChart: null | ChartXY<PointMarker, UIBackground>;
  axisX: null | Axis;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    this.channels = channels || ['No Channel'];
    this.channelCount = channels.length;
    this.type = type;
    this.xAxisChart = null;
    this.axisX = null;
    this.samplingRate = samplingRate;
    this.containerId = containerId;
    this.seriesLineColorArr = ['#E3170A', '#00FFFF', '#ABFF4F', '#FFFFFF']; //Colors for each series: ['red','yellow','cyan', 'white']
    this.TOILegend = null;
    this.ChartOptions = null;
    this.UIPanel = null;
  }

  // Chart dashboard
  createDashboard(numberOfRows: number, container: string): Dashboard {
    // const fillStyle = new SolidFill({
    //   color: ColorHEX('#111'),
    // });

    const dashboard = lightningChart().Dashboard({
      numberOfRows: numberOfRows + 1, //Total number of rows for the dashboard - default 8
      numberOfColumns: 2, //Full width
      container, //div id to attach to
      antialias: true,
      theme: spectrumTheme,
      devicePixelRatio: true,
      lineAntiAlias: true,
    });

    dashboard.setColumnWidth(0, 1);
    dashboard.setColumnWidth(1, 11);

    for (let i = 0; i < numberOfRows + 1; i += 1) {
      if (i === 0) {
        dashboard.setRowHeight(0, 0.25);
      } else {
        dashboard.setRowHeight(i, 1);
      }
    }
    dashboard.setRowHeight(5, 0.5);

    return dashboard;
  }

  // Create chart per each channel
  createChartPerChannel(channels: string[], dashboard: Dashboard) {
    // Create X Axis
    this.xAxisChart = dashboard.createChartXY({
      rowIndex: 0,
      columnIndex: 1,
      defaultAxisX: {
        opposite: true,
      },
    });

    // Create an array containing all the charts that is being created
    const charts = channels.map((_channel, i) => {
      let chart: ChartXY<PointMarker, UIBackground>;
      chart = dashboard
        .createChartXY({
          rowIndex: i + 1,
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
            thickness: 1.25,
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
    this.dashboard.setSplitterStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorHEX('#222') }),
      })
    );

    this.dashboard.setSplitterStyleHighlight(
      () =>
        new SolidLine({
          thickness: 4,
          fillStyle: new SolidFill({ color: ColorHEX('#333') }),
        })
    );

    charts.forEach((chart) => {
      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();
      // Set the Y axis to be fitting to the data
      axisY.setScrollStrategy(AxisScrollStrategies.fitting);
      axisY.setThickness(65);

      // Set Interval to 30s
      axisX.setInterval(0, 30000);
      axisX
        .setThickness(0)
        .setStrokeStyle(emptyLine)
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setTickStrategy(AxisTickStrategies.Empty)
        .setStrokeStyle(emptyLine);

      axisY.setInterval(-50, 50);

      const uiMajorTickFont = new FontSettings({
        size: 10,
        family: 'Inter, Arial, sans-serif',
        style: 'normal',
      });

      axisY.setTickStrategy(AxisTickStrategies.Numeric, (ticks) =>
        ticks
          .setMajorTickStyle((majorTickStyle) =>
            majorTickStyle

              .setGridStrokeStyle(emptyLine)
              .setLabelFillStyle(new SolidFill({ color: ColorHEX('#f7f7f7') }))
              .setLabelFont(uiMajorTickFont)
          )
          .setMinorTickStyle(emptyTick)
      );

      // Remove all chart titles
      chart.setTitleFillStyle(emptyFill);

      // Disable default auto cursor.
      chart.setAutoCursorMode(AutoCursorModes.disabled);

      // Padding
      chart.setPadding({ top: 5, bottom: 5 });

      chart.setMouseInteractionWheelZoom(false);
      chart.setMouseInteractionsWhileScrolling(false);

      // Set AxisY Units
      axisX.setTitleFont(
        new FontSettings({
          size: 12,
        })
      );
      axisY.setTitleFont(
        new FontSettings({
          size: 12,
        })
      );
    });
  }

  customizeXAxis() {
    if (this.xAxisChart) {
      this.xAxisChart.setTitleFillStyle(emptyFill);
      this.xAxisChart.setPadding({ top: 0, bottom: 0, right: 10, left: 10 });

      const [axisX, axisY] = this.xAxisChart.getDefaultAxes();
      this.axisX = axisX;

      // Y Axis
      axisY.setThickness(65);
      axisY.setTickStrategy(AxisTickStrategies.Empty);
      axisY
        .setStrokeStyle(emptyLine)
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setTickStrategy(AxisTickStrategies.Empty)
        .setStrokeStyle(emptyLine);

      const uiMinorTickFont = new FontSettings({
        size: 10,
        family: 'Inter, Arial, sans-serif',
        style: 'normal',
      });

      const uiMajorTickFont = new FontSettings({
        size: 12,
        family: 'Inter, Arial, sans-serif',
        style: 'normal',
      });

      // X Axis
      axisX.setThickness(35);
      axisX.setStrokeStyle(emptyLine);
      axisX.setTickStrategy(AxisTickStrategies.Time, (visibleTick) =>
        visibleTick
          .setMajorTickStyle((majorTick) =>
            majorTick
              .setGridStrokeStyle(emptyLine)
              .setLabelFillStyle(new SolidFill({ color: ColorHEX('#f7f7f7') }))
              .setLabelFont(uiMajorTickFont)
          )
          .setMinorTickStyle((minorTick: VisibleTicks) =>
            minorTick
              .setGridStrokeStyle(emptyLine)
              .setLabelFillStyle(new SolidFill({ color: ColorHEX('#f7f7f7') }))
              .setLabelFont(uiMinorTickFont)
          )
      );
    }
  }

  uiList(charts: ChartXY<PointMarker, UIBackground>[], dashboard: Dashboard) {
    charts.forEach((_chart, i) => {
      // const axisX = chart.getDefaultAxisX();
      // const axisY = chart.getDefaultAxisY();
      const panel = dashboard.createUIPanel({
        columnIndex: 0,
        rowIndex: i + 1,
      });

      const legendLayout = panel
        .addUIElement(UILayoutBuilders.Column)
        .setOrigin(UIOrigins.Center)
        .setMargin({ top: -10 })
        .setMouseInteractions(false)
        .setBackground((bg: any) =>
          bg.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
        );

      if (this.channels[i] === 'TOI') {
        legendLayout
          .addElement(UIElementBuilders.TextBox)
          .setText(this.channels[i])
          .setTextFont((font: any) => font.setSize(16));
      } else {
        legendLayout
          .addElement(UIElementBuilders.TextBox)
          .setText(this.channels[i])
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

      if (this.channels[i] === 'TOI') {
        this.TOILegend = legendLayout
          .addElement(UIElementBuilders.TextBox)
          .setText('-')
          .setMargin({ top: 5, bottom: 0 })
          .setTextFont((font: any) => font.setSize(24));
      }

      const legendLayoutSmall = panel
        .addUIElement(UILayoutBuilders.Column)
        .setOrigin(UIOrigins.Center)
        .setMargin({ top: -10 })
        .setMouseInteractions(false)
        .setBackground((bg: any) =>
          bg.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
        );
      legendLayoutSmall
        .addElement(UIElementBuilders.CheckBox)
        .setText('')
        .setMargin({ top: 5 })
        .setBackground((background: any) =>
          background.setFillStyle(
            new SolidFill({
              color: ColorHEX(this.seriesLineColorArr[i]),
            })
          )
        );
      legendLayoutSmall.dispose();

      panel.onResize((_chart, width, height) => {
        requestAnimationFrame(() => {
          if (height < 100 || width < 80) {
            legendLayout.dispose();
            legendLayoutSmall.restore();
          } else {
            legendLayoutSmall.dispose();
            legendLayout.restore();
          }
        });
      });
    });
  }

  // Synchronizes all X axis to have the same interval/move at the same time
  synchronizeXAxis(charts: ChartXY<PointMarker, UIBackground>[]) {
    const syncedAxes = charts.map((chart) => chart.getDefaultAxisX());
    const xAxis = (this.xAxisChart &&
      this.xAxisChart.getDefaultAxisX()) as Axis;
    syncedAxes.unshift(xAxis);
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
}

export default ChartClass;
