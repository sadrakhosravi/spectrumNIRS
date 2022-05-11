/**
 * The first index is the channel keys: starts with `'ch'` + `channel index`.
 * The seconds index is the LED keys: starts with `led` + `led index`.
 * The channel name starts with 'ch1' and the LED name starts with 'led0' which is the ambient.
 * @example Channel name: 'ch1' | LED name: 'led0'.
 */
export type DeviceADCDataType = {
  [key: string]: {
    [key: string]: Int32Array;
  };
};

/**
 * ADC Device data as a single channel.
 * Key indices starts with `led` + the `led index`.
 * @example LED name: 'led0'. LED 0 is the ambient.
 */
export type ChannelDataType = {
  [key: string]: Int32Array;
};
