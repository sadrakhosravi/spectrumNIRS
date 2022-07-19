import { ipcMain, BrowserWindow, dialog } from 'electron';
import { DialogBoxChannels } from '@utils/channels';

ipcMain.handle(DialogBoxChannels.MessageBox, (_, options) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) return dialog.showMessageBox(focusedWindow, options);
  return null;
});

ipcMain.handle(DialogBoxChannels.MessageBoxSync, (_, options) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) return dialog.showMessageBoxSync(focusedWindow, options);
  return null;
});

// Pops up a save dialog box and return the user select path
ipcMain.handle(DialogBoxChannels.GetSaveDialog, () =>
  // Show save dialog to get the export file path.
  dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow() as BrowserWindow)
);
