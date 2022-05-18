/*---------------------------------------------------------------------------------------------
 *  Registers the menu item as a native menu.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { ipcMain, Menu, globalShortcut } from 'electron';

// Channels
import { MenuChannels, ErrorChannels } from '../../../utils/channels';

// Windows
import { renderers } from '../index';

export class RegisterGlobalShortcuts {
  /**
   * All shortcuts that have been registered.
   */
  private registeredShortcuts: string[];
  constructor() {
    this.registeredShortcuts = [];
    this.init();
    this.listenForChangesFromUI();
  }

  /**
   * Initializes the menu and registers listeners.
   */
  private init() {
    this.createMenu();
    this.appendDefaultShortcuts();

    // Dev mode only
    setTimeout(() => {
      // this.setDevModeReload();
    }, 2000);
  }

  /**
   * Detect reload
   */
  private setDevModeReload() {
    renderers.mainWindow?.webContents.on('did-navigate', () => {
      globalShortcut.unregisterAll();
      this.registeredShortcuts.length = 0;
      this.init();
    });
  }

  /**
   * Creates the application menu and registers it natively.
   */
  private createMenu() {
    Menu.setApplicationMenu(new Menu());
  }

  /**
   * Adds the menu item to the native menu.
   */
  public registerShortcut(shortcut: string, callback?: () => void, id?: string) {
    // Check if the shortcut is already registered.
    const isRegistered = globalShortcut.isRegistered(shortcut);

    if (isRegistered) {
      this.sendErrorToMainUI('Shortcut Already Registered: ' + shortcut);
      return;
    }

    globalShortcut.register(shortcut, () =>
      callback
        ? callback()
        : renderers.mainWindow?.webContents.send(MenuChannels.ACCELERATOR_PUSHED, id),
    );
  }

  /**
   * Sends an error message to the main UI.
   */
  private sendErrorToMainUI(message: string) {
    if (renderers.mainWindow) {
      renderers.mainWindow.webContents.send(ErrorChannels.MAIN_PROCESS_ERROR, message);
      return;
    }

    setTimeout(() => {
      renderers.mainWindow?.webContents.send(ErrorChannels.MAIN_PROCESS_ERROR, message);
    }, 2000);
  }

  /**
   * Listens for menu changes sent from UI.
   */
  private listenForChangesFromUI() {
    // Listen for menu append.
    ipcMain.handle(
      MenuChannels.REGISTER_SHORTCUT,
      (_, { accelerator, id }: { accelerator: string; id: string }) =>
        this.registerShortcut(accelerator, undefined, id),
    );
  }

  /**
   * Append default menu items.
   */
  private appendDefaultShortcuts() {
    // Register dev tools.
    this.registerShortcut('CommandOrControl+Shift+I', () =>
      renderers.mainWindow?.webContents.openDevTools(),
    );

    // Reload page.
    this.registerShortcut('CommandOrControl+R', () => renderers.mainWindow?.webContents.reload());
  }
}
