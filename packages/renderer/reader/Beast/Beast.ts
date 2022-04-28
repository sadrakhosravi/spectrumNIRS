import { BeastServer } from './BeastServer';
import { BeastParser } from './BeastParser';

// Enums
import { BEAST_CMDs } from './enums';

// Types
import type { Socket } from 'socket.io';

// Create the IO server and get the instance
const server = new BeastServer();
const io = server.getIO();

// Create the parser instance
const parser = new BeastParser();

let pd_num = 0; // 0 ~ 7 -- this variable is set by user
let led_num = 0; // 0 ~ 15 -- this variable is set by user
const virtual_src_addr: any[] = [];

let beast: Socket | null;

// Listen for hardware io events
io.on('connection', (socket) => {
  beast = socket;

  // Send the default settings
  socket.emit(BEAST_CMDs.setSettings, getSettings());

  // Attach socket listeners
  socket.on(BEAST_CMDs.data, (packet: Buffer) => {
    const processedData = parser.processPacket(packet);
    console.log(processedData);
  });

  // Ask for the firmware Version
  socket.on(BEAST_CMDs.connection, () => {
    socket.emit(BEAST_CMDs.getVersion, true);
  });

  // Get the firmware version
  socket.on(BEAST_CMDs.setVersion, (version: string) => {
    console.log(version);
  });

  // TODO: Learn why this is used
  for (let i = 0; i < 4; i++) virtual_src_addr[i] = 0;

  // Test the stop and start
  setTimeout(() => testCommands(), 2000);
});

/**
 * Starts and stops the ADC for a quick test with a set timeout.
 */
const testCommands = () => {
  if (!beast) return;

  setTimeout(() => beast?.emit(BEAST_CMDs.start, true), 0.5 * 1000);
  setTimeout(() => beast?.emit(BEAST_CMDs.stop, true), 5 * 1000);
};

/**
 * @returns the settings as an object to be sent to the firmware.
 */
const getSettings = () => {
  return {
    pd_num: pd_num,
    led_num: led_num + 1,
    virtual_src_addr_4: virtual_src_addr[0],
    virtual_src_addr_5: virtual_src_addr[1],
    virtual_src_addr_6: virtual_src_addr[2],
    virtual_src_addr_7: virtual_src_addr[3],
  };
};
