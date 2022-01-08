import ElectronStore from 'electron-store';
import { settingsPath } from '@electron/paths';

const store = new ElectronStore({
  name: 'user-settings',
  fileExtension: 'json',
  cwd: settingsPath,
});

class Store {
  /**
   * Adds an item or multiple item in the store
   * @param key - You can use dot-notation in a key to access nested properties. Or a hashmap of items to set at once.
   * @param value — Must be JSON serializable. Trying to set the type undefined, function, or symbol will result in a TypeError.
   */
  public static set = (key: string, value: any) => store.set(key, value);

  /**
   * Get an item from the store
   * @param key - You can use dot-notation in a key to access nested properties. Or a hashmap of items to set at once.
   */
  public static get = (key: string) => store.get(key);

  /**
   * Delete an item from the store
   * @param key - You can use dot-notation in a key to access nested properties. Or a hashmap of items to set at once.
   */
  public static delete = (key: string) => store.delete(key);
}

export default Store;
