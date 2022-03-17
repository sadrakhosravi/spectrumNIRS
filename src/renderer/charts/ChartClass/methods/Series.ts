import { ColorHEX, SolidFill, SolidLine } from '@arction/lcjs';
import ChartClass from '../Chart';

function createSeriesForEachChart(this: ChartClass) {
  // Create a series array containing all the series created based on each chart
  const series = this.charts.map((chart, i) => {
    return chart
      .addLineSeries({
        dataPattern: {
          allowDataGrouping: true,
          // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
          pattern: 'ProgressiveX',
          // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
          regularProgressiveStep: true,
        },
      })
      .setName(this.channels[i])
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

export default createSeriesForEachChart;
