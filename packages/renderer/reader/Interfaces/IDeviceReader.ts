import type { DeviceSettingsType } from '@models/Device/DeviceModelProxy';
import AccurateTimer from '@utils/helpers/AccurateTimer';
import type { DeviceDataTypeWithMetaData, DeviceInfoType } from 'reader/models/Types';

/**
 * Device reader interface. Each device module should implement this interface.
 */
export interface IDeviceReader {
  /**
   * Stores the device internal data buffer.
   */
  internalBuffer: DeviceDataTypeWithMetaData[];

  /**
   * The garbage collection interval.
   */
  gcInterval: AccurateTimer;

  /**
   * Initializes the device reader. Registers listeners
   * and send device info the UI thread.
   */
  init(): Promise<void>;

  /**
   * Handles device walkthrough and initial handshake if the device
   * requires it.
   */
  listenForInitialWalkthrough?: { (): void };

  /**
   * Handles the device setting update.
   * @returns a boolean indicating if the update was sent to the device or not.
   */
  handleDeviceSettingsUpdate(settings: DeviceSettingsType): boolean;

  /**
   * Handles the device start signal.
   * This method should call the physical device start recording and
   * implement an interval for internal garbage collector to prevent
   * the memory from growing too much.
   */
  handleDeviceStart(): void | Promise<void>;

  /**
   * Handles the device stop signal.
   * This method should close the connection with the physical device and
   * remove all the event listeners. It should also stop the garbage collection
   * interval.
   */
  handleDeviceStop(): void | Promise<void>;

  /**
   * Calls the `getData()` method on the device parser and emits the
   * device data to the parent process.
   */
  getData(): DeviceDataTypeWithMetaData[];

  /**
   * Listens for device disconnect signal.
   * If the device gets disconnected, this method should remove
   * all event listeners and stop the garbage collection interval.
   * After all the cleanups, the method should call the `init` method again.
   */
  listenForDeviceDisconnect(): void;

  /**
   * Sends device data information to the parent process
   * to be sent to the UI process.
   */
  getDeviceInfo(): DeviceInfoType;

  /**
   * Should attach a listener to device data stream.
   */
  listenForDeviceData(): void;

  /**
   * Handles the incoming data buffer | string and call the device parser to
   * parse the packet.
   */
  handleDeviceData(data: Buffer | string): void;

  /**
   * Calls the `global.gc` to force garbage collection.
   */
  handleGarbageCollection(): void;
}
