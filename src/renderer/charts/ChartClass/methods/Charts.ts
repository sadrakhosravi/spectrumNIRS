import {
  AutoCursorModes,
  AxisScrollStrategies,
  AxisTickStrategies,
  ChartXY,
  ColorHEX,
  emptyFill,
  emptyLine,
  emptyTick,
  FontSettings,
  PointMarker,
  SolidFill,
  SolidLine,
  UIBackground,
} from '@arction/lcjs';
import ChartClass from '../Chart';

// Create chart per each channel
function createChartPerChannel(this: ChartClass) {
  // Create an array containing all the charts that is being created
  const charts = this.channels.map((_channel, i) => {
    let chart: ChartXY<PointMarker, UIBackground>;
    chart = this.dashboard
      .createChartXY({
        rowIndex: i + 1,
        columnIndex: 0,
      })
      .setPadding({ bottom: 10, top: 10, right: 10 });

    return chart;
  });

  this.dashboard.setSplitterStyle(
    new SolidLine({
      thickness: 3,
      fillStyle: new SolidFill({ color: ColorHEX('#121212') }),
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

    chart.onSeriesBackgroundMouseDown((obj, event) => {
      console.log(obj, event);
      console.log(obj.getSeries()[0].getName());
    });

    // Axis X customizations

    axisX.setInterval(0, 30000);
    axisX
      .setThickness(0)
      .setStrokeStyle(emptyLine)
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setTickStrategy(AxisTickStrategies.Empty)
      .setStrokeStyle(emptyLine);

    const uiMajorTickFont = new FontSettings({
      size: 10,
      family: 'Inter, Arial, sans-serif',
      style: 'normal',
    });

    // Axis Y customizations
    axisY
      .setScrollStrategy(AxisScrollStrategies.fitting)
      .setNibMousePickingAreaSize(0)
      .setNibStyle(emptyLine)
      .setThickness(65)
      .setInterval(-50, 50);

    axisY.setTickStrategy(AxisTickStrategies.Numeric, (ticks) =>
      ticks
        .setExtremeTickStyle(emptyTick)
        .setMajorTickStyle((majorTickStyle) =>
          majorTickStyle
            .setTickLength(5)
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

    // Disable default interactions
    chart
      .setMouseInteractionWheelZoom(false)
      .setMouseInteractionsWhileScrolling(false);

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

  return charts;
}

export default createChartPerChannel;
