/*---------------------------------------------------------------------------------------------
 *  App Menu View Model.
 *  Uses Mobx observable pattern.
 *  Handles the application main menu logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { makeAutoObservable } from 'mobx';
export interface ISubMenu {
  label: string;
  accelerator?: string;
  click?: any;
}

export interface IMenu {
  label: string;
  submenu?: ISubMenu[];
  click?: any;
}

// The default application menu template
const defaultMenuTemplate: IMenu[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Close',
        accelerator: 'Ctrl+F4',
      },
    ],
  },
];

/**
 * Handles the main application menu templates and updates
 */
export class AppMenuViewModel {
  public menu: IMenu[];

  constructor() {
    this.menu = defaultMenuTemplate;
    makeAutoObservable(this);
  }

  setMenu() {
    this.menu.push({
      label: 'File',
      submenu: [
        {
          label: 'Close',
          accelerator: 'Ctrl+F4',
        },
      ],
    });
  }
}
