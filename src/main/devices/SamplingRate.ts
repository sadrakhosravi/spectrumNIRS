import { IProbe } from '@electron/models/ProbesManager';

class SamplingRate {
  samplingRate: number;
  maxSamplingRate: number;

  constructor(probe: IProbe) {
    this.samplingRate = probe.samplingRate || 100;
    this.maxSamplingRate = probe.device.maxSamplingRate || 100;
  }

  /**
   * Gets the current sampling rate
   * @returns - The current sampling rate
   */
  getSamplingRate = () => this.samplingRate;
}

export default SamplingRate;
