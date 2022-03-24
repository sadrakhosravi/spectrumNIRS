import { DeviceDataType } from '@electron/models/DeviceReader/DeviceDataTypes';

class FixSamplingRate {
  private data: DeviceDataType[];
  private durationInMS: number;
  private samplingRate: number;
  constructor(
    data: DeviceDataType[],
    durationInMS: number,
    samplingRate: number
  ) {
    this.data = data;
    this.durationInMS = durationInMS;
    this.samplingRate = samplingRate;
  }

  /**
   * @returns the actual sampling rate of the recorded data
   */
  private getActualSamplingRate(): number {
    return this.data.length / (this.durationInMS / 1000);
  }

  /**
   * Determines the data windowing intervals based on the actual sampling rate
   * @returns the windowing interval in milliseconds
   */
  protected getWindowIntervalsInMS() {
    const actualSampRate = this.getActualSamplingRate();
    const actualFloored = Math.floor(actualSampRate);
    const actualDecimal = actualSampRate - actualFloored;

    let decimal = 0;

    // Round down
    if (actualDecimal <= 0.2 && actualDecimal >= 0.0) {
      decimal = 0;
    }

    // Round to 0.5
    if (actualDecimal > 0.2 && actualDecimal <= 0.7) {
      decimal = 0.5;
    }

    // Round to 1
    if (actualDecimal > 0.7 && actualDecimal <= 0.99) {
      decimal = 1;
    }

    // The final sampling rate used to make decisions
    const finalSamplingRate = actualFloored + decimal;

    let windowingInterval = 0;

    // Decide the windowing interval
    if (finalSamplingRate % 1 === 0.5) {
      windowingInterval = 2000;
    }

    if (finalSamplingRate % 1 === 0) {
      windowingInterval = 1000;
    }

    return windowingInterval;
  }

  /**
   * Adds missing samples based on the windowing interval
   */
  public addMissingSamples() {
    let timeSequence = 0;
    let timeDelta = 1000 / this.getActualSamplingRate();
    let dataPointCount = 0;
    const dataLength = this.data.length;

    let currSec = 1;
    let temp: any[] = []; // Holds 1 seconds of samples as temp
    let random = true;

    for (let i = 0; i < dataLength; i += 1) {
      if (Math.floor(timeSequence / 1000) === currSec) {
        // Check how many samples we are missing
        const numOfMissingSamples = this.samplingRate - dataPointCount;

        // Rounding will cause over/under sample
        let sampleDistance = random
          ? Math.floor(this.samplingRate / numOfMissingSamples)
          : Math.ceil(this.samplingRate / numOfMissingSamples);

        random = !random;

        // Create a sample for each missing sample
        for (let j = numOfMissingSamples; j > 0; j -= 1) {
          // Add samples uniformly throughout the 1 sec
          const index = Math.floor(timeSequence / 10) - sampleDistance * j;

          // Average nearest neighborhood
          const before = this.data[index - 1];
          const after = this.data[index + 1];

          // Create the sample object
          const sample: any = {};

          // Average before and after
          for (const ADC in before) {
            const beforeADC = before[ADC as keyof DeviceDataType];
            const afterADC = after[ADC as keyof DeviceDataType];
            sample[ADC] = beforeADC.map(
              (_value, i) => (beforeADC[i] + afterADC[i]) / 2
            );
          }
          // Insert sample at certain indices
          this.data.splice(index, 0, sample);
        }

        // Empty memory
        temp.length = 0;

        // Reset or increment counters
        dataPointCount = 0;
        currSec += 1;
      }

      temp.push(this.data[i]);

      // Increment counters
      dataPointCount += 1;
      timeSequence += timeDelta;
    }
  }
}

export default FixSamplingRate;
