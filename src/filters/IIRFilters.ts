import Fili from 'fili';

class IIRFilters {
  iirCalculator: any;
  constructor() {
    this.iirCalculator = new Fili.CalcCascades();
    console.log(this.iirCalculator.available());
  }

  public getLowPassFilter() {
    const lowPassFilterCoef = this.iirCalculator.lowpass({
      order: 2,
      characteristic: 'butterworth',
      Fs: 100,
      Fc: 5,
      preGain: false,
    });

    const filter = new Fili.IirFilter(lowPassFilterCoef);
    return filter;
  }
}

export default new IIRFilters();
