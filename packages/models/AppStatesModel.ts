import { makeAutoObservable } from 'mobx';
import type { AppNavStates } from '@utils/types/AppStateTypes';

export class AppStatesModel {
  public route: AppNavStates;

  constructor() {
    this.route = '';
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
