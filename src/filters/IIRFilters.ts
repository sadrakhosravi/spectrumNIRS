import Fili from 'fili';

class IIRFilters {
  private numOfChannels: number;
  private iirCalculator: any;
  filters: any[];

  constructor(numOfPDChannels: number) {
    this.numOfChannels = numOfPDChannels;
    this.filters = [];

    this.iirCalculator = new Fili.CalcCascades();
  }

  public filterData(data: any[]) {
    const dataLength = data.length;

    for (let i = 0; i < dataLength; i += 1) {
      const filteredValues = new Array(this.numOfChannels + 1).fill(0);

      for (let j = 0; j < this.numOfChannels + 1; j += 1) {
        filteredValues[j] = this.filters[j].singleStep(data[i].ADC1[j]);
      }
      data[i].ADC1 = filteredValues;
    }

    return data;
  }

  /**
   * Creates the lowpass filers for each PD channel
   */
  public createLowPassFilters(Fs: number, Fc: number, order?: number) {
    for (let i = 0; i < this.numOfChannels + 1; i += 1) {
      const lowPassFilterCoef = this.iirCalculator.lowpass({
        order: order || 6,
        characteristic: 'butterworth',
        Fs,
        Fc: Fc || 5,
        preGain: false,
      });
      const filter = new Fili.IirFilter(lowPassFilterCoef);

      this.filters.push(filter);
    }
  }
}

export default IIRFilters;
