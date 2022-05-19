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
  DEVICE_UPDATE = 'device:update',
  /**
   * Receives 1 argument, the device name to remove.
   */
  DEVICE_REMOVE = 'device:remove',
  /**
   * Get device names as a string array from reader process
   */
  GET_ALL_DEVICE_NAME = 'device:all-name',
  /**
   * All device names sent from the reader process.
   */
  ALL_DEVICE_NAME = 'device:all-name',
}
