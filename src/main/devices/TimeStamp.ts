import SamplingRate from '@electron/devices/SamplingRate';

class TimeStamp {
  samplingRate: number;
  timeStamp: number;
  delta: number;

  constructor(samplingRate: SamplingRate) {
    this.samplingRate = samplingRate.getSamplingRate();
    this.timeStamp = 0;
    this.delta = this.generateTimeDelta();
  }

  /**
   * Generates the time delta between each incoming samples.
   * @returns - The time delta between each incoming samples
   */
  generateTimeDelta = () => {
    return 1000 / this.samplingRate;
  };

  /**
   * Adds the time delta to the current timestamp.
   */
  addTimeDelta = () => {
    this.timeStamp += this.delta;
  };

  /**
   * Resets the timestamp.
   * @returns - The default timestamp = 0
   */
  resetTimeStamp = () => (this.timeStamp = 0);
}

export default TimeStamp;
