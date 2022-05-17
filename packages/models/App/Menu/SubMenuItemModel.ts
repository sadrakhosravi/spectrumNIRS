/*---------------------------------------------------------------------------------------------
 *  Menu Item Model.
 *  Creates sub menu item and its logic
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { ipcRenderer } from 'electron';
import { nanoid } from 'nanoid';

// Channels
import { MenuChannels } from '../../../utils/channels';

type ClickType = () => void;

export class SubMenuItemModel {
  public readonly label: string;
  public readonly accelerator: string | undefined;
  public readonly shortcutKeys: string | undefined;
  public readonly id: string;
  public readonly onClick!: ClickType;

  constructor(label: string, accelerator: string | undefined, onClick: ClickType) {
    this.label = label;
    this.accelerator = accelerator;
    this.shortcutKeys = this.accelerator?.replaceAll('CommandOrControl', 'Ctrl');
    this.id = nanoid();
    this.onClick = onClick;

    // Register the accelerator globally.
    this.accelerator &&
      ipcRenderer.invoke(MenuChannels.REGISTER_SHORTCUT, {
        accelerator: this.accelerator,
        id: this.id,
      });
  }
}
