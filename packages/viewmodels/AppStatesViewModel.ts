import AppStatesModel from '@models/AppStatesModel';
import type { AppNavStates } from '@utils/types/AppStateTypes';

/**
 * ViewModel for application states
 */
export class AppStatesViewModel {
  /**
   * Sets the current path of the app as a state
   */
  public static navigateTo(path: AppNavStates) {
    AppStatesModel.setAppRoute(path);
  }
}
