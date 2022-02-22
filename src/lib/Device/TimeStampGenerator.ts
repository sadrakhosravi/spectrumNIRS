import ProbeManager from '@electron/models/ProbesManager';

class TimeStampGenerator {
  samplingRate: number;
  timeStamp: number;
  delta: number;
  dataBatchSize: number;
  temp: number;

  constructor(dataBatchSize: number, lastTimeStamp?: number) {
    this.samplingRate = ProbeManager.getCurrentProbe()?.samplingRate as number;
    this.dataBatchSize = dataBatchSize;

    if (!this.samplingRate)
      throw new Error('No Probe Found! Could not read the sampling rate.');

    this.timeStamp = lastTimeStamp || 0;
    this.temp = this.timeStamp;
    this.delta = this.generateTimeDelta();
  }

  /**
   * @returns The current timestamp
   */
  public getTimeStamp = () => this.timeStamp;

  /**
   * @returns the last timestamp
   */
  public getTheLastTimeStamp = () => this.timeStamp;

  /**
   * Generates the time delta between each incoming samples.
   * @returns - The time delta between each incoming samples
   */
  private generateTimeDelta = () => {
    // 1000 ms / sampling rate
    return 1000 / this.samplingRate;
  };

  /**
   * @returns the time difference between 2 sample data point
   */
  public getTimeDelta = () => this.delta;

  public addTimeDelta = () => (this.temp += this.delta);

  /**
   * Resets the timestamp.
   * @returns - The default timestamp = 0
   */
  public resetTimeStamp = () => (this.timeStamp = 0);

  /**
   * @returns the next time stamp based on the data batch size
   */
  public generateNextTimeStamp = () => {
    this.timeStamp += this.delta * this.dataBatchSize;
    this.temp = this.timeStamp;
    return this.timeStamp;
  };
}

export default TimeStampGenerator;
