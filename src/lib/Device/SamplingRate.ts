import ProbesManager from '@electron/models/ProbesManager';
class SamplingRate {
  samplingRate: number;

  constructor() {
    this.samplingRate = ProbesManager.currentProbe?.samplingRate as number;
  }
}

export default new SamplingRate();
