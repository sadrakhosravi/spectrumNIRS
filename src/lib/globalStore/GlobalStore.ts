import Store from 'electron-store';

// Types / Interfaces
import {
  IClientStatus,
  IServerInfo,
  IServerStatus,
  IDataSize,
  IDataTypes,
} from '@electron/models/exportServer/ExportServer';

let storePath = '';

(async () => {
  if (process.type === 'renderer') {
    storePath = await window.api.invokeIPC('get-settings-path');
  } else {
    const paths = await import('@electron/paths');
    storePath = paths.settingsPath;
  }
})();

// import schema from './schema.json';

// Global store is used to share a state between the main and renderer
// processes. It relies on the electron-store module.
// Electron store uses a file based system and tracks its changes.
// The file is saved in the settings path as config.json

export interface IGlobalStore {
  exportServer: {
    serverInfo: IServerInfo;
    serverStatus: IServerStatus | null;
    clientStatus: IClientStatus[] | null;
    error: string;
    outputDataSize: IDataSize['value'];
    outputDataType: IDataTypes['value'];
    sendTo: string;
  };
}

const initialState = {
  exportServer: {},
  probes: {},
};

class GlobalStore {
  store: Store<Record<string, unknown>>;
  constructor() {
    //@ts-ignore
    this.store = new Store({
      watch: true,
      cwd: storePath,
      accessPropertiesByDotNotation: true,
    });
    // Only reset the store once when the main process loads it
    if (process.type !== 'renderer') this.store.store = initialState;
  }

  /**
   * Sets the export server state value
   */
  setExportServer = (key: keyof IGlobalStore['exportServer'], value: any) =>
    this.store.set(`exportServer.${key}`, value);

  /**
   * Removes the export server key and all its values
   */
  removeExportServer = () => this.store.set('exportServer', {});

  /**
   * Gets a value from the export server state
   */
  getExportServer = (key: keyof IGlobalStore['exportServer']) =>
    this.store.get(`exportServer.${key}`);
}

export type GlobalStoreType = GlobalStore;
export default new GlobalStore();
