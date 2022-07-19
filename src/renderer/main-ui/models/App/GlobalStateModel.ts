/*---------------------------------------------------------------------------------------------
 *  Global Data State Model.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';

/**
 * The global state model for renderers to use paths and variables that are
 * only available in the main process.
 */
class GlobalStateModel {
  /**
   * The device manager remote class instance.
   */
  public readonly reader!: Comlink.Remote<any>; // Readonly to prevent a getter method - Performance reasons
  constructor() {
    //Example
  }
}

export default new GlobalStateModel();
