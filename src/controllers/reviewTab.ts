import { BrowserWindow, dialog, ipcMain, Menu, screen } from 'electron';
import { ReviewTabChannels } from '../utils/channels';
import path from 'path';

let reviewWindow: BrowserWindow | null;

const reviewTabNewWindow = async () => {
  const displays = screen.getAllDisplays();

  const { width, height } =
    displays.length > 1 ? displays[1].workAreaSize : displays[0].workAreaSize;

  const newReviewWindow = new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    width,
    height,
    darkTheme: true,
    frame: true,
    roundedCorners: true,
    webPreferences: {
      devTools: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../main/preload.js'),
      backgroundThrottling: false,
    },
  });
  newReviewWindow.setBounds(displays[1].bounds);
  newReviewWindow.maximize();
  newReviewWindow.show();
  await newReviewWindow.loadURL('http://localhost:1212#/tabs/recording/review');
  return newReviewWindow;
};

ipcMain.on(ReviewTabChannels.ContextMenu, (event) => {
  const senderWindow: any = BrowserWindow.fromWebContents(event.sender);

  const openReviewInANewTab = async () => {
    if (reviewWindow) {
      dialog.showMessageBox(senderWindow, {
        message:
          'Review tab is already opened in a window! Please close the review window first.',
        type: 'warning',
        title: 'Review Window is Already Open',
      });
      return;
    }

    reviewWindow = await reviewTabNewWindow();
    reviewWindow.on('closed', () => {
      senderWindow.webContents.send(ReviewTabChannels.IsNewWindowOpened, false);
      reviewWindow = null;
    });
    senderWindow.webContents.send(ReviewTabChannels.IsNewWindowOpened, true);
  };

  const closeReviewWindow = () => {
    reviewWindow?.destroy();
  };

  const template: any = [
    {
      label: 'Open In A New Window',
      click: openReviewInANewTab,
    },
    { type: 'separator' },
    {
      label: 'Close Review Window',
      click: closeReviewWindow,
    },
  ];
  const menu = Menu.buildFromTemplate(template);

  menu.popup(senderWindow);
});
