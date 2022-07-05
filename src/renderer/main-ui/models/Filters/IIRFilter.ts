/*---------------------------------------------------------------------------------------------
 *  IIR Filter Model.
 *  Base model for all IIR filters.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import Fili from 'fili';

export class IIRFilter {
  /**
   * IIR calculator coefficients.
   */
  protected IIRFilters: any;

  constructor() {
    this.IIRFilters = new Fili.CalcCascades();
  }
}
