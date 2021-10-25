import { BrowserWindow, ipcMain, IpcMainEvent, Menu } from 'electron';
import path from 'path';
import { ReviewTabChannels } from '../utils/channels';

const reviewTabNewWindow = () => {
  const reviewTabWindow = new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    darkTheme: true,
    frame: true,
    roundedCorners: true,
    webPreferences: {
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, '../main/preload.js'),
      backgroundThrottling: false,
    },
  });
  reviewTabWindow.show();
  reviewTabWindow.loadURL('http://localhost:1212#/tabs/recording/record');
};

ipcMain.on(ReviewTabChannels.ContextMenu, (event: IpcMainEvent) => {
  const template: any = [
    {
      label: 'Open in a New Window',
      click: () => {
        {
          reviewTabNewWindow();
        }
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  const senderWindow: any = BrowserWindow.fromWebContents(event.sender);

  menu.popup(senderWindow);
});
