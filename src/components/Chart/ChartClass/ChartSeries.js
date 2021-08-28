'use-strict';
/**
 * Chart Series created here along with their settings
 */

import lcjs from '@arction/lcjs';

const { SolidFill, SolidLine, ColorHEX } = lcjs;

class ChartSeries {
  constructor(charts, seriesLineColorArr) {
    this.charts = charts; //All charts that were created.
    this.seriesLineColorArr = seriesLineColorArr; //Array of strings - each index contains a HEX color code.

    this.series = [];
    this.createSeries();

    return this.series; //Return an array of series attached to each chart.
  }

  /**
   * Attaches a line series to each chart in the this.charts array
   */
  createSeries() {
    //Create a series for each chart
    for (let i = 0; i < this.charts.length; i++) {
      const chartSeries = this.charts[i]
        .addLineSeries({
          dataPattern: {
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
            // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
            regularProgressiveStep: false,
          },
        })
        .setDataCleaning({ maxDataPointCount: 2000 })
        .setMaxPointCount(2000) //Cleanup method

        //Styling
        .setStrokeStyle(
          new SolidLine({
            thickness: 2,
            fillStyle: new SolidFill({ color: ColorHEX(this.seriesLineColorArr[i]) }),
          }),
        );

      //Add the created series to the series array
      this.series.push(chartSeries);
    }
  }
}

export default ChartSeries;
