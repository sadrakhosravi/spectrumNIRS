import { ipcMain, BrowserWindow, app, Menu, IpcMainEvent } from 'electron';

// Controllers
import './experiment';
import './patient';
import './recording';
import './recordTab';

// Minimize window on minimize icon click
ipcMain.on('window:minimize', (event: IpcMainEvent) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

// Close/quit window on minimize icon click
ipcMain.on('window:close', () => {
  app.quit();
});

// Restore window on minimize icon click
ipcMain.on('window:restore', (event: IpcMainEvent) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  mainWindow?.isMaximized() === true
    ? mainWindow.restore()
    : mainWindow?.maximize();
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
