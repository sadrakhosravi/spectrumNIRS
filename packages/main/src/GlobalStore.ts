import Store from 'electron-store';
import MainPaths from './MainPaths';

export class GlobalStore {
  /**
   * The electron store instance.
   */
  private globalStore: Store;

  constructor() {
    this.globalStore = new Store({
      cwd: MainPaths.globalStorePath,
      name: 'store',
    });
  }
}
