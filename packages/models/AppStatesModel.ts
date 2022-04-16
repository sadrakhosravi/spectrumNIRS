/*---------------------------------------------------------------------------------------------
 *  Singleton AppState Model.
 *  Uses MobX observable pattern
 *--------------------------------------------------------------------------------------------*/

import { makeAutoObservable } from 'mobx';
import type { AppNavStates } from '@utils/types/AppStateTypes';

export class AppStatesModel {
  public route: AppNavStates;

  constructor() {
    this.route = 'calibration'; //FIXME: Revert back to '' as the default route. Only for debugging
    makeAutoObservable(this);
  }

  /**
   * Sets the app route variable
   */
  public setAppRoute(newRoute: AppNavStates) {
    this.route = newRoute;
  }
}

export default new AppStatesModel();
