import { BrowserWindow, dialog } from 'electron';

/**
 * A static class for showing common dialog box messages
 * Conventions: user id = 0 for cancel button to keep it consistent throughout the app
 */
class DialogBox {
  /**
   * Prompts the user for app quit confirmation
   * @returns true if the user confirms the dialog box or false otherwise
   */
  public static exitConfirmation() {
    const win = BrowserWindow.getFocusedWindow() as BrowserWindow;
    const confirmation = dialog.showMessageBoxSync(win, {
      title: 'Confirm App Quit',
      message: 'Are you sure you want to quit the application?',
      detail: 'All unsaved data will be lost',
      buttons: ['Cancel', 'Quit'],
      noLink: true,
      type: 'warning',
      defaultId: 0,
    });
    return confirmation === 1 ? true : false;
  }
}

export default DialogBox;
