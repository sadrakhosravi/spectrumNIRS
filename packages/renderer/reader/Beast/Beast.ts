import { BeastServer } from './BeastServer';
import { BeastParser } from './Parser';

// Enums
import { BEAST_CMDs } from './enums';

// Types
import type { Socket } from 'socket.io';

// Create the IO server and get the instance
const server = new BeastServer();
const io = server.getIO();

// Create the parser instance
const parser = new BeastParser();

let beast: Socket | null;

// Listen for hardware io events
io.on('connection', (socket) => {
  beast = socket;

  // Attach socket listeners
  socket.on(BEAST_CMDs.data, (packet: Buffer) => {
    // const processedData = parser.processPacket(packet);
    console.log(packet);
  });

  // Test the stop and start
  testCommands();
});

/**
 * Starts and stops the ADC for a quick test with a set timeout.
 */
const testCommands = () => {
  if (!beast) return;

  setTimeout(() => beast.emit(BEAST_CMDs.start, true), 1 * 1000);
  setTimeout(() => beast.emit(BEAST_CMDs.stop, true), 5 * 1000);
};
