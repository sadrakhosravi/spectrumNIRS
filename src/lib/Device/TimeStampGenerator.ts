import SamplingRate from '@lib/Device/SamplingRate';

class TimeStampGenerator {
  samplingRate: number;
  timeStamp: number;
  delta: number;

  constructor() {
    this.samplingRate = SamplingRate.samplingRate;
    this.timeStamp = 0;
    this.delta = this.generateTimeDelta();
  }

  /**
   * @returns The current timestamp
   */
  public getTimeStamp = () => this.timeStamp;

  /**
   * Generates the time delta between each incoming samples.
   * @returns - The time delta between each incoming samples
   */
  private generateTimeDelta = () => {
    return 1000 / this.samplingRate;
  };

  /**
   * Adds the time delta to the current timestamp.
   */
  public addTimeDelta = () => (this.timeStamp += this.delta);
  /**
   * Resets the timestamp.
   * @returns - The default timestamp = 0
   */
  public resetTimeStamp = () => (this.timeStamp = 0);
}

export default new TimeStampGenerator();
