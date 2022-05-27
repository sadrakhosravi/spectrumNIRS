import Store from 'electron-store';
import MainPaths from './MainPaths';

import { schema } from './GlobalStore/DeviceStoreSchema';

export class GlobalStore {
  /**
   * The electron store instance.
   */
  private deviceStore!: Store;

  constructor() {
    this.initDeviceStore();
  }

  /**
   * Initializes the device store. Resets previous configs.
   */
  private initDeviceStore() {
    this.deviceStore = new Store({
      cwd: MainPaths.globalStorePath,
      name: 'devices',
    });

    // Clear device store configs.
    this.deviceStore.clear();

    // Set the default schema
    this.deviceStore.store = schema;
  }
}
