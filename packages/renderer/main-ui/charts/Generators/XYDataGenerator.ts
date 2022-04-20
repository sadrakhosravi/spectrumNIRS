import { createProgressiveRandomGenerator } from '@arction/xydata';

/**
 * Uses the `@arction LCJS` data generator to create a stream of data
 * @version 0.1.0
 * @alpha
 */
export class XYDataGenerator {
  constructor() {}

  /**
   * Creates a stream of randomly generated data at a specific frequency and update rate
   * @param frequency - the frequency of data points
   * @param rate - the rate of stream output in milliseconds
   * @returns a stream
   */
  public createStreamableData(frequency: number, rate: number) {
    // create new instance of progressive random generator
    return (
      createProgressiveRandomGenerator()
        // define that 1000 points should be generated
        .setNumberOfPoints(frequency)
        // generate those 1000 points
        .generate()
        // set stream to progress every 250 milliseconds
        .setStreamInterval(rate)
        // set stream to output 10 points at a time
        .setStreamBatchSize(frequency)
        // make the stream infinite
        .setStreamRepeat(true)
        // create a new stream with previously defined stream settings
        .toStream()
    );
  }
}
