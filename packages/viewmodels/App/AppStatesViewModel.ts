import AppStatesModel from '../../models/App/AppStatesModel';
import type { AppNavStates } from '../../utils/types/AppStateTypes';

/**
 * ViewModel for application states
 */
export class AppStatesViewModel {
  /**
   * The app state model instance.
   */
  private model: AppStatesModel;
  constructor() {
    this.model = new AppStatesModel();
  }

  /**
   * The current application route.
   */
  public get route() {
    return this.model.route;
  }

  /**
   * Sets the current path of the app as a state
   */
  public navigateTo(path: AppNavStates) {
    this.model.appRoute = path;
  }
}
