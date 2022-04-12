import { makeAutoObservable } from 'mobx';

export class AppRoutes {
  route = '';

  constructor() {
    makeAutoObservable(this);
  }

  public setRoute(path: string) {
    this.route = path;
  }
}

export default new AppRoutes();
