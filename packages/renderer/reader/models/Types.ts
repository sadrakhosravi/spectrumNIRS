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
  hasProbeSettings: boolean;
};

/**
 * Device name type used for fetching all device names.
 */
export type DeviceNameType = {
  name: string;
  isActive: boolean;
};

/// ---------------------------- Spectrum Device Data Types ---------------------------- ///

// Standard data type that spectrum parses each data to.
type DeviceADCKeyNumbersRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type DeviceADCKeyType = `ADC${DeviceADCKeyNumbersRange}`;

type DeviceChannelKeyNumbersRange = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type DeviceChannelKeyType = `ch${DeviceChannelKeyNumbersRange}`;

export type DeviceChannelDataType = Partial<Record<DeviceChannelKeyType, Int32Array>>;
export type DeviceADCDataType = Partial<Record<DeviceADCKeyType, DeviceChannelDataType>>;

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

/// ---------------------------- Spectrum Device Data Types - END ---------------------------- ///
