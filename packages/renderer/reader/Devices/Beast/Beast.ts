// Types
import { BeastPhysicalDevice } from './BeastPhysicalDevice';

// Create the socket.io server for beast
const beastDevice = new BeastPhysicalDevice();

console.log('Waiting for beast to connect ...');

/**
 * Listens for beast's connection initiation
 */
const listenForBeastConnection = () => {
  console.log('Checking for beast...');

  const isConnected = beastDevice.getIsConnected();
  if (!isConnected) return;

  console.log('Beast connected!');

  // Clear the current interval
  window.clearInterval(deviceCheckInterval);
  setImmediate(() => window.clearInterval());
};

const deviceCheckInterval = setInterval(listenForBeastConnection, 1000);

// // Create the parser instance
// const parser = new BeastParser();

// const virtual_src_addr: any[] = [];

// let beast: Socket | null;

// // Listen for hardware io events
// io.on('connection', (socket) => {
//   beast = socket;
//   new BeastInput(socket);

//   // Attach socket listeners
//   socket.on(BEAST_CMDs.data, (packet: Buffer) => {
//     const processedData = parser.processPacket(packet);
//     console.log(processedData);
//   });

//   // Ask for the firmware Version
//   socket.on(BEAST_CMDs.connection, () => {
//     socket.emit(BEAST_CMDs.getVersion, true);
//   });

//   // Get the firmware version
//   socket.on(BEAST_CMDs.setVersion, (version: string) => {
//     console.log(version);
//   });

//   // TODO: Learn why this is used
//   for (let i = 0; i < 4; i++) virtual_src_addr[i] = 0;

//   // Test the stop and start
//   setTimeout(() => testCommands(), 2000);
// });

// /**
//  * Starts and stops the ADC for a quick test with a set timeout.
//  */
// const testCommands = () => {
//   if (!beast) return;

//   setTimeout(() => beast?.emit(BEAST_CMDs.start, true), 0.5 * 1000);
//   setTimeout(() => beast?.emit(BEAST_CMDs.stop, true), 5 * 1000);
// };
