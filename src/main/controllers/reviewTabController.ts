import { resolveHtmlPath } from '@electron/util';
import { BrowserWindow } from 'electron';
// import path from 'path';

export const openReviewTabInNewWindow = async () => {
  const newReviewTab = await new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      // preload: path.join(__dirname, '../preload.js'),
    },
  });
  await newReviewTab.loadURL(resolveHtmlPath('index.html/&#35;review'));
  newReviewTab.show();
};
