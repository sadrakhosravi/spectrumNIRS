/*---------------------------------------------------------------------------------------------
 *  Electron Store Service.
 *  The global shared state service using electron store.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { action, makeObservable, observable, runInAction } from 'mobx';

import ElectronStore from 'electron-store';
import { ipcRenderer } from 'electron';
import { PathChannels } from '../utils/channels';

// Interfaces
import type { IServices } from './IServicesInterface';
import type { DeviceInfoType } from '../renderer/reader/api/Types';

// Store schemas
import { schema } from '../main/src/GlobalStore/DeviceStoreSchema';

/**
 * Device state data type
 */
export type DeviceStoreType = {
  /**
   * All device module names and info.
   */
  allDeviceNamesAndInfo: { name: string; isActive: boolean }[];
  /**
   * Active device modules info
   */
  activeDeviceModules: DeviceInfoType[];

  /**
   * The application recording state
   */
  isRecordingData: boolean;
};

export class ElectronStoreService implements IServices {
  private deviceStore!: ElectronStore;
  /**
   * Electron store's change listener unSubscriber function.
   */
  private deviceStateChangeUnSubscriber: any;
  /**
   * The device store state observables.
   */
  @observable devicesState!: DeviceStoreType;

  constructor() {
    this.deviceStateChangeUnSubscriber = null;

    this.devicesState = schema;

    makeObservable(this);
  }

  /**
   * The store and its exposed functions.
   */
  public get store() {
    return {
      deviceStore: {
        store: this.devicesState,
        setDeviceStoreValue: this.setDeviceStoreValue.bind(this),
        getDeviceStoreValue: this.getDeviceStoreValue.bind(this),
        getDeviceStoreNestedValue: this.getDeviceStoreNestedValue.bind(this),
        setDeviceStoreNestedValue: this.setDeviceStoreNestedValue.bind(this),
        removeDeviceStoreState: this.removeDeviceStoreState.bind(this),
      },
    };
  }

  /// -------------------------- Device Store -------------------------- ///

  /**
   * Sets a key value pair in the device store.
   */
  private setDeviceStoreNestedValue<
    K extends keyof DeviceStoreType,
    T extends DeviceStoreType[K][any],
  >(key: K, nestedKey: string, value: T) {
    this.deviceStore.set(key + '.' + nestedKey, value);
  }

  /**
   * Gets a nested value from the device store.
   */
  private getDeviceStoreNestedValue<K extends keyof DeviceStoreType, T extends DeviceStoreType[K]>(
    key: K,
    nestedKey: string,
  ) {
    this.deviceStore.get(key + '.' + nestedKey) as T;
  }

  /**
   * Sets a key value pair in the device store.
   */
  private setDeviceStoreValue<K extends keyof DeviceStoreType, T extends DeviceStoreType[K]>(
    key: K,
    value: T,
  ) {
    this.deviceStore.set(key, value);
  }

  /**
   * Get a key value pair in the device store.
   */
  private getDeviceStoreValue<K extends keyof DeviceStoreType>(key: K) {
    return this.deviceStore.get(key) as DeviceStoreType[K];
  }

  /**
   * Removes the key from the device store state.
   */
  private removeDeviceStoreState(key: keyof DeviceStoreType, nestedKey: string) {
    if (!nestedKey) {
      this.deviceStore.delete(key);
      return;
    }
    this.deviceStore.delete(key + '.' + nestedKey);
  }

  /// -------------------------- Device Store End -------------------------- ///

  /**
   * Initialize service.
   */
  @action public initService = async () => {
    this.deviceStore = new ElectronStore({
      cwd: await ipcRenderer.invoke(PathChannels.GLOBAL_STORE_PATH),
      name: 'devices',
      watch: true,
    });

    const currentStore = this.deviceStore.store;

    runInAction(() => {
      // Get the default values and set it in the observables
      for (const key in currentStore) {
        this.devicesState[key as keyof DeviceStoreType] = currentStore[key] as any;
      }
    });

    // Subscribe to changes in device state
    this.deviceStateChangeUnSubscriber = this.deviceStore.onDidAnyChange((newVal) => {
      runInAction(() => {
        for (const key in newVal) {
          this.devicesState[key as keyof DeviceStoreType] = newVal[key] as any;
        }
      });
    });
  };

  /**
   * Shut down service.
   */
  async shutdownService() {
    // UnSubscribe from listeners.
    this.deviceStateChangeUnSubscriber();
    this.deviceStore.clear(); // FOR DEBUG ONLY
  }
}
