/**
 * The device synchronization channel.
 * Used to synchronize UI and reader processes.
 */
export enum DeviceChannels {
  /**
   * Receives 1 argument, the device name to add.
   */
  DEVICE_ADD = 'device:add',
  /**
   * Should receive 2 arguments, the device name and the update.
   */
  DEVICE_SETTINGS_UPDATE = 'device:update',
  /**
   * Receives 1 argument, the device name to remove.
   */
  DEVICE_REMOVE = 'device:remove',
  /**
   * Receives 2 argument, the device name and device information object.
   */
  DEVICE_INFO = 'device:info',
  /**
   * Get device names as a string array from reader process
   */
  GET_ALL_DEVICE_NAMES = 'device:all-name',
  /**
   * All device names sent from the reader process.
   */
  ALL_DEVICE_NAMES = 'device:all-name',
  /**
   * Should reply with all active devices of the reader process.
   */
  GET_ALL_ACTIVE_DEVICES = 'device:get-all-active-devices',
  /**
   * Device connection status as a boolean.
   */
  CONNECTION_STATUS = 'device:connection-status',
  /**
   * Device streaming status as boolean.
   */
  STREAMING_STATUS = 'device:streaming-status',
  /**
   * Device data channel. The device name should be added to the end!
   */
  DEVICE_DATA = 'device:data-',
}
