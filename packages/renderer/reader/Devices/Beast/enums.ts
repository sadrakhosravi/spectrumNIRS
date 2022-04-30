/**
 * Socket.io Server settings
 */
export enum IO_SERVER {
  port = 3000,
  ip = 'localhost',
}

export enum BEAST_CMDs {
  // Send events
  start = 'ADC-Start',
  stop = 'ADC-Stop',
  getVersion = 'Get-Version',
  setSettings = 'Set-Settings',

  // Received events
  data = 'ADC-DATA',
  connection = 'Connection',
  setVersion = 'Set-Version',
}
