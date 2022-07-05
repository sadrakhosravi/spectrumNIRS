import { nanoid } from 'nanoid';
import { SubMenuItemModel } from '@models/App/Menu/SubMenuItemModel';

// Shortcuts
import { ShortcutsEnum } from '../../../../../main/menu/ShortcutsEnum';
import { appRouterVM, recordingVM } from '@store';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

/**
 * File menu and its logic.
 */
export const FileMenu = {
  label: 'File',
  id: nanoid(),

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  submenu: [
    // New Recording
    new SubMenuItemModel(
      'New Recording',
      `${ShortcutsEnum.CTRL}+${ShortcutsEnum.SHIFT}+N`,
      () => {
        appRouterVM.navigateTo(AppNavStatesEnum.NEW_RECORDING);
      }
    ),

    // Open Recording
    new SubMenuItemModel('Open Recording', `${ShortcutsEnum.CTRL}+O`, () => {
      appRouterVM.navigateTo(AppNavStatesEnum.HOME);
    }),

    // Close Recording
    new SubMenuItemModel(
      'Close Recording',
      `${ShortcutsEnum.CTRL}+${ShortcutsEnum.SHIFT}+W`,
      () => {
        recordingVM.setCurrentRecording(null);
      }
    ),

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    new SubMenuItemModel('Separator', undefined, () => {}),

    // Close the application
    new SubMenuItemModel('Quit', `${ShortcutsEnum.CTRL}+Q`, () => {
      console.log('Quit');
    }),
  ],
};
