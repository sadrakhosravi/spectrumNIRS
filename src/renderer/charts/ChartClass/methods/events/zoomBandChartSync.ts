import ReviewChart from '../../ReviewChart';
import { Band, ChartXY, PointMarker, UIBackground } from '@arction/lcjs';
import { Token } from '@arction/eventer';

function zoomBandChartSync(
  this: ReviewChart,
  zoomBandChart: ChartXY<PointMarker, UIBackground>,
  band: Band
) {
  // Default starting values
  let bandValueStart = 0;
  let bandValueEnd = 30000;

  band.setValueStart(bandValueStart);
  band.setValueEnd(bandValueEnd);

  const subToScaleChange = () =>
    this.xAxisChart.getDefaultAxisX().onScaleChange((start, end) => {
      band.setValueStart(start);
      band.setValueEnd(end);
    });

  let xAxisScaleChangeToken = subToScaleChange();
  let valueChangeToken: Token;

  // Only change xAxisChart interval on mouse enter to prevent infinite loop
  band.onMouseEnter(() => {
    valueChangeToken = band.onValueChange((_, start, end) => {
      this.xAxisChart?.getDefaultAxisX().setInterval(start, end, false, true);
      bandValueStart = start;
      bandValueEnd = end;
    });

    this.xAxisChart.getDefaultAxisX().offScaleChange(xAxisScaleChangeToken);
  });

  // Cleanup listener on mouse leave
  band.onMouseLeave(() => {
    band.offValueChange(valueChangeToken);
    xAxisScaleChangeToken = subToScaleChange();
  });

  // Add jump to a point on click
  zoomBandChart.onSeriesBackgroundMouseClick(() => {
    const nearestPoint = zoomBandChart.solveNearest();
    const interval = this.xAxisChart.getDefaultAxisX().getInterval();
    const timeDiv = (interval.end - interval.start) / 2;

    if (nearestPoint) {
      const { location } = nearestPoint;
      const bandValueMiddle = (bandValueEnd - bandValueStart) / 2;
      band.setValueStart(location.x - bandValueMiddle);
      band.setValueEnd(location.x + bandValueMiddle);

      this.xAxisChart
        ?.getDefaultAxisX()
        .setInterval(location.x - timeDiv, location.x + timeDiv, false, true);
    }
  });
}

export default zoomBandChartSync;
