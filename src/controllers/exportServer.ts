import { ipcMain } from 'electron';
import ExportServer from '@electron/models/ExportServer';
import { ExportServerChannels } from '@utils/channels';

let exportServer: ExportServer | undefined;

/**
 * Starts the export server and send the initial data to the UI
 */
const startServer = async () => {
  exportServer = new ExportServer();
  await exportServer.start();

  // Send the info after 100ms
  setTimeout(() => {
    console.log('Send Server Info');
    exportServer?.sendServerInfo();
    exportServer?.sendServerStatus();
  }, 100);
};

/**
 * Stops the export server and clean the memory
 */
const stopServer = () => {
  exportServer?.stop();
  exportServer = undefined;
};

// Starts the export server
ipcMain.handle(ExportServerChannels.StartServer, () => {
  if (!exportServer) {
    startServer();
  }
});

// Stops the server
ipcMain.on(ExportServerChannels.StopServer, () => {
  stopServer();
});

// Restart server
ipcMain.handle(ExportServerChannels.RestartServer, async () => {
  try {
    exportServer && stopServer();
    setTimeout(async () => await startServer(), 1500);
    return true;
  } catch (err: any) {
    throw new Error(err.message);
  }
});

// Delete client
ipcMain.handle(
  ExportServerChannels.RemoveClient,
  (_event, socketId: string) => {
    exportServer?.removeSocket(socketId);
  }
);
