/*---------------------------------------------------------------------------------------------
 *  Down Sampler Model.
 *  Down samples the data for all channels of the PD.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import EventEmitter from 'events';

// Types
// import type { DeviceADCDataType } from '../../renderer/reader/types/DeviceDataType';

export class DownSampler {
  /**
   * The current sampling rate of the device.
   */
  private currSamplingRate: number;
  /**
   * The down sampled rate of the device.
   */
  private downsampledRate: number;
  /**
   * The down sampling factor = currSamplingRate / downsampledRate.
   */
  private downsamplingFactor: number;
  /**
   * The temp object to hold the data while being downsampled.
   */
  private temp: any;
  /**
   * The down sampled data that is ready to be read.
   */
  protected downsampledData: any;
  /**
   * THe data index used to determine if it has reached the downsampling factor.
   */
  protected dataIndex: number;
  /**
   * The data event emitter.
   */
  private emitter: EventEmitter;

  constructor(
    currSamplingRate: number,
    downsampledRate: number,
    totalChannels: number,
    totalLEDs: number
  ) {
    this.currSamplingRate = currSamplingRate;
    this.downsampledRate = downsampledRate;
    this.temp = {};
    this.downsampledData = {};
    this.dataIndex = 0;

    if (downsampledRate > currSamplingRate) {
      throw new Error(
        'Downsampled rate cannot be greater than the device sampling rate'
      );
    }

    this.downsamplingFactor = this.currSamplingRate / this.downsampledRate;

    if (this.downsamplingFactor % 1 !== 0) {
      throw new Error('The downsampling factor cannot be a floating number');
    }

    // Create the temp object with all the Channels and LEDs.
    for (let i = 0; i < totalChannels; i++) {
      const channelName = 'ch' + (i + 1);
      this.temp[channelName] = {};

      for (let j = 0; j < totalLEDs + 1; j++) {
        this.temp[channelName]['led' + j] = [];
      }
    }

    // Create the emitter obj
    this.emitter = new EventEmitter();
  }

  /**
   * The data event emitter. Should listen to the `data` event.
   */
  public get dataEmitter() {
    return this.emitter;
  }

  /**
   * Processes the data for down sampling. Emits the `data` event when the data is ready.
   * @param data the device ADC sorted data.
   */
  public processData(data: any) {
    const channels = Object.keys(data);
    const leds = Object.keys(data['ch1']);
    this.resetTemp(channels.length, leds.length);

    const totalWindows =
      data[channels[0]][leds[0]].length / this.downsamplingFactor;

    // Loop through each objects channel.
    for (let i = 0; i < channels.length; i++) {
      const channelName = channels[i];

      // Loop through each channel's LED.
      for (let j = 0; j < leds.length; j++) {
        const ledData = data[channelName][leds[j]];

        for (let k = 0; k < totalWindows; k++) {
          const windowedData = ledData.splice(0, this.downsamplingFactor);
          const avg =
            windowedData.reduce((prev: any, curr: any) => prev + curr) /
            this.downsamplingFactor;
          this.temp[channelName][leds[j]].push(avg);
        }
      }
    }

    return this.temp;
  }

  protected emitData() {
    this.emitter.emit('data', this.temp);
    this.dataIndex = 0;
  }

  /**
   * Clears the temp object's current data.
   */
  protected resetTemp(numOfChannels: number, numOfLEDs: number) {
    // Loop through channels
    for (let i = 0; i < numOfChannels; i++) {
      const channelName = 'ch' + (i + 1);

      // Loop through LEDs
      for (let j = 0; j < numOfLEDs; j++) {
        this.temp[channelName]['led' + j].length = 0;
      }
    }
  }
}
