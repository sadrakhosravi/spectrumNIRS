import { nanoid } from 'nanoid';
import { SubMenuItemModel } from '../../../models/App/Menu/SubMenuItemModel';

// Shortcuts
import { ShortcutsEnum } from '../../../main/src/Menu/ShortcutsEnum';
import { appRouterVM } from '../../VMStore';
import { AppNavStatesEnum } from '../../../utils/types/AppStateEnum';

/**
 * File menu and its logic.
 */
export const File = {
  label: 'File',
  id: nanoid(),

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  submenu: [
    // New Recording
    new SubMenuItemModel('New Recording', `${ShortcutsEnum.CTRL}+${ShortcutsEnum.SHIFT}+N`, () => {
      appRouterVM.navigateTo(AppNavStatesEnum.CALIBRATION);
    }),

    // Open Recording
    new SubMenuItemModel('Open Recording', `${ShortcutsEnum.CTRL}+O`, () => {
      console.log('New Recording');
    }),

    // Close Recording
    new SubMenuItemModel('Close Recording', `${ShortcutsEnum.CTRL}+${ShortcutsEnum.SHIFT}+W`, () =>
      appRouterVM.navigateTo(AppNavStatesEnum.HOME),
    ),

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    new SubMenuItemModel('Separator', undefined, () => {}),

    // Close the application
    new SubMenuItemModel('Quit', `${ShortcutsEnum.CTRL}+Q`, () => {
      console.log('Quit');
    }),
  ],
};
