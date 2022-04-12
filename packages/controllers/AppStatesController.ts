import AppStatesModel from '@models/AppStatesModel';
import type { AppNavStates } from '@utils/types/AppStateTypes';

/**
 * Controller for application states
 */
export class AppStatesController {
  /**
   * Sets the current path of the app as a state
   */
  public static navigateTo(path: AppNavStates) {
    AppStatesModel.setAppRoute(path);
  }
}
