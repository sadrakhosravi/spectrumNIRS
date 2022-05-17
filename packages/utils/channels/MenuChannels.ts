/**
 * Application menu channels used for registering native menus.
 */
export enum MenuChannels {
  REGISTER_SHORTCUT = 'menu:register-shortcut',
  UNREGISTER_SHORTCUT = 'menu:unregister-shortcut',
  ACCELERATOR_PUSHED = 'menu:accelerator-pushed',
}
