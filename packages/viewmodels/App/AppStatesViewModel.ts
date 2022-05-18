import { action, makeObservable, observable, runInAction } from 'mobx';
import { AppNavStatesEnum } from '../../utils/types/AppStateEnum';

/**
 * ViewModel for application states
 */
export class AppStatesViewModel {
  /**
   * The current application route
   */
  @observable public route: AppNavStatesEnum;
  /**
   * Application loading state
   */
  @observable private _isLoading: boolean;
  constructor() {
    this.route = AppNavStatesEnum.CALIBRATION; //FIXME: Revert back to '' as the default route. Only for debugging
    this._isLoading = false;
    makeObservable(this);
  }

  /**
   * Whether the application is loading or not.
   */
  public get isLoading() {
    return this._isLoading;
  }

  /**
   * Sets the application
   */
  public set appLoading(value: boolean) {
    this._isLoading = value;
  }

  /**
   * Sets the current path of the app as a state
   */
  @action public async navigateTo(path: AppNavStatesEnum) {
    this._isLoading = true;
    this.route = path;

    setTimeout(() => {
      runInAction(() => {
        this.appLoading = false;
      });
    }, 1000);
  }
}
