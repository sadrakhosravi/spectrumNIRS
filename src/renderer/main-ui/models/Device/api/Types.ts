/**
 * Device information object type.
 */
export type DeviceInfoType = {
  id: string;
  name: string;
  version: string;
  ADCRes: number;
  DACRes: number;
  numOfADCs: number;
  numOfChannelsPerPD: number;
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
type DeviceADCKeyNumbersRange = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type DeviceADCKeyType = `ADC${DeviceADCKeyNumbersRange}`;

type DeviceChannelKeyNumbersRange =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;
type DeviceChannelKeyType = `ch${DeviceChannelKeyNumbersRange}`;

type DeviceChannelDataType0 = Record<'ch0', Int32Array>;
type DevDeviceChannelKeyType1 = Record<'ADC1', DeviceChannelDataType0>;

export type DeviceChannelDataType = DeviceChannelDataType0 &
  Partial<Record<DeviceChannelKeyType, Int32Array>>;
export type DeviceADCDataType = DevDeviceChannelKeyType1 &
  Partial<Record<DeviceADCKeyType, DeviceChannelDataType>>;

/**
 * The device calculated data type.
 */
export type DeviceCalculatedDataType = {
  [key: string]: {
    [key: string]: Float32Array;
  };
};

/**
 * The device data along with the meta data added when the packet reached
 * Spectrum.
 */
export type DeviceDataTypeWithMetaData = {
  data: DeviceADCDataType;
  calcData?: DeviceCalculatedDataType;
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
