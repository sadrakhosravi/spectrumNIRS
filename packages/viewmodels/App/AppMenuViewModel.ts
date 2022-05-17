/*---------------------------------------------------------------------------------------------
 *  App Menu View Model.
 *  Uses Mobx observable pattern.
 *  Handles the application main menu logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { ipcRenderer } from 'electron';
import { action, makeObservable, observable } from 'mobx';
import { MenuChannels } from '../../utils/channels/MenuChannels';

// Types
import type { SubMenuItemModel } from '../../models/App/Menu/SubMenuItemModel';

// Menu items
import { File } from './MenuItems/File';

export interface IMenu {
  label: string;
  id: string;
  submenu?: SubMenuItemModel[];
  click?: any;
}

// The default application menu template
const defaultMenuTemplate: IMenu[] = [File];

/**
 * Handles the main application menu templates and updates
 */
export class AppMenuViewModel {
  /**
   * The array containing all the application menu.
   */
  @observable public menu: IMenu[];
  /**
   * The current submenu parent label or null if no sub menu is open.
   */
  @observable private currSubMenuOpen: string;

  constructor() {
    this.menu = defaultMenuTemplate;
    this.currSubMenuOpen = '';
    makeObservable(this);
    this.registerListener();
  }

  /**
   * The current sub menu that is open or null if none.
   */
  public get currSubMenu() {
    return this.currSubMenuOpen;
  }

  /**
   * Sets the current sub menu that is open.
   */
  @action public setCurrSubMenuOpen(value: string) {
    this.currSubMenuOpen = value;
  }

  /**
   * Registers the listener for accelerator press.
   */
  private registerListener() {
    console.log('Register');
    ipcRenderer.on(MenuChannels.ACCELERATOR_PUSHED, (_, id) => {
      // Find the submenu with the accelerator and click it
      this.menu.forEach((menuItem) => {
        const subMenuItemPushed = menuItem.submenu?.find((item) => item.id === id);
        subMenuItemPushed?.onClick();
      });
    });
  }
}
