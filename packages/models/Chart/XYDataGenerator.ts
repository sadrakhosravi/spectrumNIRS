import { createProgressiveTraceGenerator, createProgressiveRandomGenerator } from '@arction/xydata';

export class XYDataGenerator {
  /**
   * Creates a Progressive data generator based on the given number of points
   * @returns a promise containing the generated data
   */
  public static staticData(numOfPoints: number) {
    return createProgressiveTraceGenerator().setNumberOfPoints(numOfPoints).generate().toPromise();
  }

  /**
   * Creates a data generator stream.
   * @param numOfPoints The number of data points to generate on each stream interval
   * @returns a data stream to be consumed
   */
  public static streamData(numOfPoints: number) {
    return (
      createProgressiveRandomGenerator()
        // define that 1000 points should be generated
        .setNumberOfPoints(numOfPoints)
        // generate those 1000 points
        .generate()
        // set stream to progress every 250 milliseconds
        .setStreamInterval(10)
        // set stream to output 10 points at a time
        .setStreamBatchSize(numOfPoints / 10)
        // make the stream infinite
        .setStreamRepeat(true)
        // create a new stream with previously defined stream settings
        .toStream()
    );
  }
}
