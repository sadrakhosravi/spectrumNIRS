import { DeviceDataType } from '@electron/models/DeviceReader/DeviceDataTypes';
import EventEmitter from 'events';

/**
 * Downsampler class that takes in data, downsamples it and
 * returns the data in an event emitter structure.
 */
class DownSampler {
  private deviceSamplingRate: number;
  private downSampledRate: number;
  private downSamplingFactor: number;

  private batchSize: number;
  private temp: DeviceDataType;
  private output: DeviceDataType;
  private count: number;
  private dataEmitter: EventEmitter;
  private numOfADCChannels: number;

  constructor(
    deviceSamplingRate: number = 100,
    downSampledRate: number = 20,
    batchSize: number,
    numOfADCChannels: number,
    numOfPDs: number
  ) {
    this.deviceSamplingRate = deviceSamplingRate;
    this.downSampledRate = downSampledRate;
    this.batchSize = batchSize;
    this.numOfADCChannels = numOfADCChannels;

    this.dataEmitter = new EventEmitter();

    //@ts-ignore
    this.temp = {};
    //@ts-ignore
    this.output = {};

    // Create the object based on num of PDs
    for (let i = 0; i < numOfPDs; i += 1) {
      this.temp[`ADC${i + 1}` as keyof DeviceDataType] = new Array(
        numOfADCChannels
      ).fill(0);
      this.output[`ADC${i + 1}` as keyof DeviceDataType] = new Array(
        numOfADCChannels
      ).fill(0);
    }

    console.log(this.temp);

    this.count = 0;

    // Check down sampled rate
    if (this.downSampledRate > this.deviceSamplingRate) {
      throw new Error(
        'The down sampled rate cannot be higher than the device sampling rate!'
      );
    }

    this.downSamplingFactor = this.deviceSamplingRate / this.downSampledRate;

    // Check sampling factor
    if (this.downSamplingFactor % 1 !== 0) {
      throw new Error(
        `The down sample factor cannot be a decimal.
        Please make sure that the device sampling rate divided by the down sampled rate produces an integer.`
      );
    }
  }

  /**
   * @returns the data emitter for downsampled data
   */
  public getDataEmitter() {
    return this.dataEmitter;
  }

  /**
   * Downsamples the data that was passed in and returns it
   * @param data - The data batch to be downsampled
   */
  public downSampleData(data: DeviceDataType[]) {
    for (let i = 0; i < this.batchSize; i += 1) {
      for (const ADC in data[i]) {
        // Separate ADC data
        const dataPoint = data[i][ADC as keyof DeviceDataType];

        // Add the values to the temp value to be averaged
        for (let j = 0; j < this.numOfADCChannels; j += 1) {
          this.temp[ADC as keyof DeviceDataType][j] += dataPoint[j];
        }
        this.count++;
      }

      // When the num of data points reach the downsampling factor, average and emit data
      if (this.downSamplingFactor === this.count) {
        // For each ADC/PDs, average data
        for (const ADC in this.temp) {
          // Average data
          for (let k = 0; k < this.numOfADCChannels; k += 1) {
            this.output[ADC as keyof DeviceDataType][k] = Math.round(
              this.temp[ADC as keyof DeviceDataType][k] /
                this.downSamplingFactor
            );
            this.temp[ADC as keyof DeviceDataType][k] = 0; // reset temp data
          }
        }

        // Emit when data is ready
        this.dataEmitter.emit('data', this.output);
        this.count = 0;
      }
    }
  }

  public downSampleDataSync(data: DeviceDataType[]) {
    const tempData: DeviceDataType[] = [];
    for (let i = 0; i < this.batchSize; i += 1) {
      for (const ADC in data[i]) {
        // Separate ADC data
        const dataPoint = data[i][ADC as keyof DeviceDataType];
        // Add the values to the temp value to be averaged
        for (let j = 0; j < this.numOfADCChannels; j += 1) {
          this.temp['ADC1'][j] += dataPoint[j];
        }
        this.count++;
      }

      // When the num of data points reach the downsampling factor, average and emit data
      if (this.downSamplingFactor === this.count) {
        // For each ADC/PDs, average data
        for (const ADC in this.temp) {
          const adcData = new Array(this.numOfADCChannels).fill(0);

          // Average data
          for (let k = 0; k < this.numOfADCChannels; k += 1) {
            adcData[k] =
              this.temp[ADC as keyof DeviceDataType][k] /
              this.downSamplingFactor;
            this.temp[ADC as keyof DeviceDataType][k] = 0; // reset temp data
          }

          tempData.push({ [ADC as keyof DeviceDataType]: adcData });
        }

        // Emit when data is ready
        this.count = 0;
      }
    }
    console.log(tempData.slice());
    return tempData;
  }
}

export default DownSampler;
