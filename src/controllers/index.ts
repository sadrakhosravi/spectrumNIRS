import { ipcMain, BrowserWindow, Menu, IpcMainEvent } from 'electron';

// Controllers
import './window';
import './experiment';
import './patient';
import './recording';
import './recordTab';

ipcMain.on('context-menu', (event: IpcMainEvent) => {
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
