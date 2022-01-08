import {
  SolidLine,
  SolidFill,
  ColorHEX,
  AutoCursorModes,
  AxisScrollStrategies,
  AxisTickStrategies,
  ColorRGBA,
  emptyFill,
} from '@arction/lcjs';

import ReviewChart from '../ReviewChart';
import zoomBandChartSync from './events/zoomBandChartSync';

function zoomBandChart(this: ReviewChart) {
  const zoomBandChart = this.dashboard.createChartXY({
    rowIndex: this.numberOfRows,
    columnIndex: 0,
  });

  this.zoomBandChartSeries = this.series.map((_, i) => {
    return zoomBandChart
      .addLineSeries({
        dataPattern: {
          // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
          pattern: 'ProgressiveX',
          // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
          regularProgressiveStep: false,
        },
      })
      .setDataCleaning(undefined)
      .setStrokeStyle(
        new SolidLine({
          thickness: 1.25,
          fillStyle: new SolidFill({
            color: ColorHEX(this.seriesLineColorArr[i]),
          }),
        })
      );
  });

  const [axisX, axisY] = zoomBandChart.getDefaultAxes();

  // Customize Y Axis
  axisY.setTickStrategy(AxisTickStrategies.Empty);
  axisY.setScrollStrategy(AxisScrollStrategies.fitting);
  axisY.setThickness(65);
  axisY.setMouseInteractions(false);

  // Customize X Axis
  axisX.setTickStrategy(AxisTickStrategies.Empty);
  axisX.setScrollStrategy(AxisScrollStrategies.fitting);

  // Customize Chart
  zoomBandChart.setTitleFillStyle(emptyFill);
  zoomBandChart.setAutoCursorMode(AutoCursorModes.disabled);
  zoomBandChart.setMouseInteractionRectangleFit(false);
  zoomBandChart.setMouseInteractionsWhileScrolling(false);
  zoomBandChart.setMouseInteractionRectangleZoom(false);
  zoomBandChart.setMouseInteractionPan(false);
  zoomBandChart.setMouseInteractionWheelZoom(false);
  zoomBandChart.setPadding({ top: 0, right: 10, bottom: 0, left: 10 });

  // Customize Band
  const band = axisX.addBand();
  this.zoomBandBand = band;

  const bandStrokeStyle = (size: number) =>
    new SolidLine({
      thickness: size,
      fillStyle: new SolidFill({ color: ColorHEX('#007ACD') }),
    });

  band.setFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255, 25) }));
  band.setStrokeStyle(bandStrokeStyle(0));

  band.onMouseEnter(() => {
    band.setStrokeStyle(bandStrokeStyle(2));
  });
  band.onMouseLeave(() => {
    band.setStrokeStyle(bandStrokeStyle(0));
  });

  zoomBandChartSync.bind(this)(zoomBandChart, band);

  return zoomBandChart;
}

export default zoomBandChart;
