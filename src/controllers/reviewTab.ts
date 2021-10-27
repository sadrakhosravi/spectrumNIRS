import { BrowserWindow, ipcMain, IpcMainEvent, Menu, screen } from 'electron';
import path from 'path';
import { ReviewTabChannels } from '../utils/channels';

const reviewTabNewWindow = async () => {
  const displays = screen.getAllDisplays();

  const { width, height } =
    displays.length > 1 ? displays[1].workAreaSize : displays[0].workAreaSize;

  console.log(displays);

  const reviewTabWindow = new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    width,
    height,
    darkTheme: true,
    frame: true,
    roundedCorners: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../main/preload.js'),
      backgroundThrottling: false,
    },
  });
  reviewTabWindow.setBounds(displays[1].bounds);
  reviewTabWindow.maximize();
  reviewTabWindow.show();
  await reviewTabWindow.loadURL('http://localhost:1212#/tabs/recording/review');
  return reviewTabWindow;
};

ipcMain.on(ReviewTabChannels.ContextMenu, (event: IpcMainEvent) => {
  const senderWindow: any = BrowserWindow.fromWebContents(event.sender);
  const template: any = [
    {
      label: 'Open in a New Window',
      click: async () => {
        {
          const reviewWindow = await reviewTabNewWindow();
          senderWindow.send(ReviewTabChannels.IsNewWindowOpened, true);
          reviewWindow.on('closed', () =>
            senderWindow.send(ReviewTabChannels.IsNewWindowOpened, false)
          );
        }
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);

  menu.popup(senderWindow);
});
