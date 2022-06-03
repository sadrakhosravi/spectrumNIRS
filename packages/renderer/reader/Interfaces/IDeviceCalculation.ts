import type { DeviceCalculatedDataType, DeviceInfoType } from 'reader/api/Types';
import type { V5ParserDataType } from 'reader/Devices/V5/V5Parser';

/**
 * Device calculation interface.
 */
export interface IDeviceCalculation {
  /**
   * Initializes the device calculation class and sets the default values
   */
  init(deviceInfo: DeviceInfoType): void;
  /**
   * Sets the number of data points that will be processed at a time.
   */
  setBatchSize(value: number): void;
  /**
   * Processes the data batch and returns the calculated data object.
   */
  processData(data: V5ParserDataType): DeviceCalculatedDataType;
  /**
   * Sets the LED intensity values for calculation
   */
  setLEDIntensities: { (LEDIntensities: number[]): void };
}
