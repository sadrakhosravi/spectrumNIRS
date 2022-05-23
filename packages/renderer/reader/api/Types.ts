/**
 * Types of events that the device worker module will receive.
 */
export enum EventFromDeviceToWorkerEnum {
  START = 'start',
  STOP = 'stop',
  SETTINGS_UPDATE = 'settings_update',
  GET_DATA = 'get-data',
}

/**
 * Message data structure that the device worker
 * module will receive from the reader process.
 */
export type EventFromDeviceToWorkerType = {
  event: EventFromDeviceToWorkerEnum;
  data: any;
};

/**
 * Events names that the device worker will send to the reader process.
 */
export enum EventFromWorkerEnum {
  DEVICE_CONNECTION_STATUS = 'device:connection-status',
  INPUT_STATUS = 'device:input-status',
  DEVICE_SPI_DATA = 'device:data-spi',
  DEVICE_DATA = 'device:data',
  DEVICE_INFO = 'device:info',
}

/**
 * The data type sent by the worker threads to the reader process.
 */
export type EventFromWorkerType = {
  event: EventFromWorkerEnum;
  data: any;
};
