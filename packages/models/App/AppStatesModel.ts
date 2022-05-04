/*---------------------------------------------------------------------------------------------
 *  Singleton AppState Model.
 *  Uses MobX observable pattern
 *--------------------------------------------------------------------------------------------*/

import { makeAutoObservable } from 'mobx';
import type { AppNavStates } from '../../utils/types/AppStateTypes';

export class AppStatesModel {
  public route: AppNavStates;

  constructor() {
    this.route = 'calibration'; //FIXME: Revert back to '' as the default route. Only for debugging
    makeAutoObservable(this);
  }

  /**
   * Setter for application route.
   */
  public set appRoute(route: AppNavStates) {
    this.route = route;
  }
}

export default AppStatesModel;
