/**
 * Socket.io Server settings
 */
export enum IO_SERVER {
  port = 3000,
  ip = 'localhost',
}

export enum BeastCmd {
  // Send events
  START = 'ADC-Start',
  STOP = 'ADC-Stop',
  GET_VERSION = 'Get-Version',
  SET_SETTINGS = 'Set-Settings',

  // Received events
  ADC_DATA = 'ADC-DATA',
  CONNECTION = 'Connection',
  SET_VERSION = 'Set-Version',
}
