/*---------------------------------------------------------------------------------------------
 *  Lowpass Model.
 *  An implementation of a butter worth lowpass filter
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import Fili from 'fili';
import { IIRFilter } from './IIRFilter';

export interface Filter {
  multiStep(data: number[] | Float32Array | Int32Array, overwrite?: boolean): number[];
  singleStep(num: number, overwrite?: boolean): number;
}

export class Lowpass extends IIRFilter {
  constructor() {
    super();
  }

  /**
   * Creates and return the lowpass filter instance.
   * @returns the lowpass filter instance.
   */
  public createLowpassFilter(fs: number, fc: number, order: number): Filter {
    const lowpassCoef = this.IIRFilters.lowpass({
      order: order,
      characteristic: 'butterworth',
      Fs: fs,
      Fc: fc,
      preGain: false,
    });
    const lowpassFilter = new Fili.IirFilter(lowpassCoef);

    return lowpassFilter;
  }
}

export const cutoffFrequencies = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 100, 200, 400, 500];
export const orders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
