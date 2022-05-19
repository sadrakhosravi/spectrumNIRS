/**
 * Types of events that the device worker module will receive.
 */
export enum DeviceWorkerEventEnum {
  START = 'start',
  STOP = 'stop',
  SETTINGS_UPDATE = 'settings_update',
  GET_DATA = 'get-data',
}

/**
 * Message data structure that the device worker
 * module will receive from the reader process.
 */
export type DeviceWorkerEventDataType = {
  event: DeviceWorkerEventEnum;
  data: any;
};

/**
 * Events names that the device worker will send to the reader process.
 */
export enum EventFromWorkerEnum {
  DEVICE_CONNECTED = 'device:connected',
  INPUT_STATUS = 'device:input-status',
  DEVICE_SPI_DATA = 'device:data-spi',
  DEVICE_DATA = 'device:data',
}

/**
 * The data type sent by the worker threads to the reader process.
 */
export type ReaderWorkersDataType = {
  event: EventFromWorkerEnum;
  data: any;
};
