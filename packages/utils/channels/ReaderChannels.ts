/**
 * Device Reader IPC Channels enum.
 */
export enum ReaderChannels {
  START = 'recording:start',
  STOP = 'recording:stop',
  PAUSE = 'recording:pause',
  DEVICE_DATA = 'recording:device-data',
}

export default ReaderChannels;
