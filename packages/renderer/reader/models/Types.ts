/**
 * Device information object type.
 */
export type DeviceInfoType = {
  id: string;
  name: string;
  version: string;
  numOfPDs: number;
  numOfLEDs: number;
  defaultSamplingRate: number;
  supportedSamplingRate: number[];
  PDChannelNames: string[];
  calculatedChannelNames: string[];
};

/**
 * Device name type used for fetching all device names.
 */
export type DeviceNameType = {
  name: string;
  isActive: boolean;
};

/**
 * The first index is the channel keys: starts with `'ch'` + `channel index`.
 * The seconds index is the LED keys: starts with `led` + `led index`.
 * The channel name starts with 'ch1' and the LED name starts with 'led0' which is the ambient.
 * @example Channel name: 'ch1' | LED name: 'led0'.
 */
export type DeviceADCDataType = {
  [key: string]: {
    [key: string]: number[];
  };
};

/**
 * The device data along with the meta data added when the packet reached
 * Spectrum.
 */
export type DeviceDataTypeWithMetaData = {
  data: DeviceADCDataType;
  metadata: {
    timestamp: number;
  };
};

/**
 * The device name and its data and metadata
 */
export type DeviceNameAndDataType = {
  deviceName: string;
  data: DeviceDataTypeWithMetaData;
};

/**
 * ADC Device data as a single channel.
 * Key indices starts with `led` + the `led index`.
 * @example LED name: 'led0'. LED 0 is the ambient.
 */
export type ChannelDataType = {
  [key: string]: number[];
};
