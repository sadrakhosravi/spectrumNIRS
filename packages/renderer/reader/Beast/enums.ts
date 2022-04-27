/**
 * Socket.io Server settings
 */
export enum IO_SERVER {
  port = 5000,
  ip = 'localhost',
}

export enum BEAST_CMDs {
  // Send events
  start = 'ADC-Start',
  stop = 'ADC-Stop',

  // Received events
  data = 'ADC-DATA',
}
