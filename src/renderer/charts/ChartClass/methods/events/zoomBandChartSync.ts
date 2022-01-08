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

  let valueChangeToken: Token;

  // Only change xAxisChart interval on mouse enter to prevent infinite loop
  band.onMouseEnter(() => {
    valueChangeToken = band.onValueChange((_, start, end) => {
      this.xAxisChart?.getDefaultAxisX().setInterval(start, end, false, true);
      bandValueStart = start;
      bandValueEnd = end;
    });
  });

  // Cleanup listener on mouse leave
  band.onMouseLeave(() => {
    band.offValueChange(valueChangeToken);
  });

  // Add jump to a point on click
  zoomBandChart.onSeriesBackgroundMouseClick(() => {
    const nearestPoint = zoomBandChart.solveNearest();
    if (nearestPoint) {
      const { location } = nearestPoint;
      console.log(location);
      const bandValueMiddle = (bandValueEnd - bandValueStart) / 2;
      band.setValueStart(location.x - bandValueMiddle);
      band.setValueEnd(location.x + bandValueMiddle);
      this.xAxisChart
        ?.getDefaultAxisX()
        .setInterval(location.x - 30000, location.x + 30000, false, true);
    }
  });
}

export default zoomBandChartSync;
