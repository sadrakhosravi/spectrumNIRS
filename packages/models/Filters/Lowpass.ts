/*---------------------------------------------------------------------------------------------
 *  Lowpass Model.
 *  An implementation of a butter worth lowpass filter
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import Fili from 'fili';
import { IIRFilter } from './IIRFilter';

export class Lowpass extends IIRFilter {
  constructor() {
    super();
  }

  /**
   * Creates and return the lowpass filter instance.
   * @returns the lowpass filter instance.
   */
  public createLowpassFilter() {
    const lowpassCoef = this.IIRFilters.lowpass({
      order: 6,
      characteristic: 'butterworth',
      Fs: 1000,
      Fc: 5,
      preGain: false,
    });
    const lowpassFilter = new Fili.IirFilter(lowpassCoef);

    return lowpassFilter;
  }
}
