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
  @observable private loading: { status: boolean; transparent: boolean; message: string };
  constructor() {
    this.route = AppNavStatesEnum.CALIBRATION; //FIXME: Revert back to '' as the default route. Only for debugging
    this.loading = { status: false, transparent: false, message: '' };
    makeObservable(this);
  }

  /**
   * Whether the application is loading or not.
   */
  public get isLoading() {
    return this.loading;
  }

  /**
   * Sets the application
   */
  @action public setAppLoading(
    status: boolean,
    transparent?: boolean,
    message?: string,
    timerInMS?: number,
  ) {
    if (status === this.loading.status) return;

    this.loading = {
      status,
      transparent: transparent || false,
      message: message || 'Loading...',
    };

    if (timerInMS) {
      setTimeout(() => {
        runInAction(() => this.setAppLoading(false));
      }, timerInMS);
    }
  }

  /**
   * Sets the current path of the app as a state
   */
  @action public async navigateTo(path: AppNavStatesEnum) {
    // this.setAppLoading(true);
    this.route = path;

    // setTimeout(() => {
    //   runInAction(() => {
    //     this.setAppLoading(false);
    //   });
    // }, 1000);
  }
}
