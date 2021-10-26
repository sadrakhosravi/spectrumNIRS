import { ipcMain, BrowserWindow, dialog } from 'electron';
import { DialogBoxChannels } from '../utils/channels';

ipcMain.handle(DialogBoxChannels.MessageBox, (_, options) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow && dialog.showMessageBox(focusedWindow, options);
});
