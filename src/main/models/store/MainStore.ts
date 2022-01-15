import ElectronStore from 'electron-store';
import { settingsPath } from '@electron/paths';

class MainStore {
  store: ElectronStore<Record<string, unknown>>;

  constructor() {
    this.store = new ElectronStore({
      name: 'user-settings',
      fileExtension: 'json',
      cwd: settingsPath,
    });
  }

  /**
   * Adds an item or multiple item in the store
   * @param key - You can use dot-notation in a key to access nested properties. Or a hashmap of items to set at once.
   * @param value — Must be JSON serializable. Trying to set the type undefined, function, or symbol will result in a TypeError.
   */
  public set = (key: string, value: any) => this.store.set(key, value);

  /**
   * Get an item from the store
   * @param key - You can use dot-notation in a key to access nested properties. Or a hashmap of items to set at once.
   */
  public get = (key: string) => this.store.get(key);

  /**
   * Delete an item from the store
   * @param key - You can use dot-notation in a key to access nested properties. Or a hashmap of items to set at once.
   */
  public delete = (key: string) => this.store.delete(key);
}

export default new MainStore();
