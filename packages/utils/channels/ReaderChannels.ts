/**
 * Device Reader IPC Channels enum.
 */
export enum ReaderChannels {
  DEVICE_SETTING_UPDATE = 'device:update-settings',
  DEVICE_CONNECTED = 'device:connected',
  DEVICE_START = 'device:start',
  DEVICE_STOP = 'device:stop',
  DEVICE_DATA = 'device:data',
  DEVICE_INPUT_RESPONSE = 'device:input-response',
}
