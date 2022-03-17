import {
  AxisScrollStrategies,
  AxisTickStrategies,
  // Band,
  ChartXY,
  ColorHEX,
  emptyFill,
  emptyLine,
  FontSettings,
  // Point,
  PointMarker,
  SolidFill,
  UIBackground,
  VisibleTicks,
} from '@arction/lcjs';
import ChartClass from '../Chart';

// Create chart per each channel
function xAxisChart(this: ChartClass) {
  // Create X Axis
  const chart = this.dashboard.createChartXY({
    rowIndex: 0,
    columnIndex: 0,
    defaultAxisX: {
      opposite: true,
    },
  }) as ChartXY<PointMarker, UIBackground>;

  chart.setTitleFillStyle(emptyFill);
  chart.setPadding({ top: 0, bottom: 0, right: 10, left: 10 });

  const [axisX, axisY] = chart.getDefaultAxes();

  // Y Axis
  axisY.setThickness(65);
  axisY.setTickStrategy(AxisTickStrategies.Empty);
  axisY
    .setStrokeStyle(emptyLine)
    .setScrollStrategy(undefined)
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
  axisX.setScrollStrategy(AxisScrollStrategies.progressive);
  axisX.setStrokeStyle(emptyLine);
  axisX.setTickStrategy(AxisTickStrategies.Time, (visibleTick: any) =>
    visibleTick
      .setMajorTickStyle((majorTick: any) =>
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
  axisX.setNibMousePickingAreaSize(0);

  // let interval: any;
  // let bands: Band[] = [];
  // let count = 0;

  // axisX.onAxisInteractionAreaMouseDragStart(() => {
  //   bands.forEach((band) => band.dispose());
  //   count = 0;
  //   interval = axisX.getInterval();
  //   this.charts &&
  //     this.charts.forEach((chart) => {
  //       const xAxis = chart.getDefaultAxisX();
  //       const band = xAxis.addBand();
  //       band.setMouseInteractions(false);

  //       bands.push(band);
  //     });
  // });

  // let startPoint: Point;
  // axisX.onAxisInteractionAreaMouseDrag((_obj, event, _button) => {
  //   requestAnimationFrame(() => {
  //     if (count === 0) {
  //       count = 2;
  //       startPoint = this.translateXAxisPixelToAxisCoordinates(
  //         event.clientX,
  //         event.clientY
  //       );
  //       bands.forEach((band) =>
  //         band.setValueStart(startPoint.x).setValueEnd(startPoint.x)
  //       );
  //     }
  //     bands.forEach((band) => {
  //       band.setValueEnd(
  //         this.translateXAxisPixelToAxisCoordinates(
  //           event.clientX,
  //           event.clientY
  //         ).x
  //       );
  //     });
  //     console.log(event.clientX);
  //   });
  // });

  // axisX.onAxisInteractionAreaMouseDragStop((_obj, event) => {
  //   if (event.button === 1) {
  //     bands[0].onMouseDown((_, event) => {
  //       console.log(event);
  //     });
  //     setTimeout(() => {
  //       axisX.setInterval(interval.start, interval.end, 200, true);
  //     }, 2);
  //   }
  // });

  return chart;
}

export default xAxisChart;
