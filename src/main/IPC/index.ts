/**
 * IPC Main communications index file.
 */

import { ipcMain, BrowserWindow, app, Menu } from 'electron';

// Controllers
import '../../controllers/experiment';
import '../../controllers/patient';
import '../../controllers/recording';
import '../../controllers/recordTab';

const ipc = () => {
  // Get the main window open
  const mainWindow = BrowserWindow.getAllWindows()[0];

  // Minimize window on minimize icon click
  ipcMain.on('window:minimize', () => {
    mainWindow.minimize();
  });

  // Close/quit window on minimize icon click
  ipcMain.on('window:close', () => {
    app.quit();
  });

  // Restore window on minimize icon click
  ipcMain.on('window:restore', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    mainWindow.isMaximized() === true
      ? mainWindow.restore()
      : mainWindow.maximize();
  });

  ipcMain.on('context-menu', (event) => {
    const template: any = [
      {
        label: 'Open in a New Window',
        click: () => {
          {
            console.log('test');
          }
        },
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    const senderWindow: any = BrowserWindow.fromWebContents(event.sender);

    menu.popup(senderWindow);
  });
};

export default ipc;
