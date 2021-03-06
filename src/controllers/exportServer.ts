import { ipcMain } from 'electron';
import ExportServer from '@electron/models/ExportServer/ExportServer';
import { ExportServerChannels } from '@utils/channels';

export let exportServer: ExportServer | undefined;

// Starts the server and sends the initial data to the UI
const startServer = async () => {
  exportServer = new ExportServer();
  await exportServer.start();

  // Send the info after 100ms
  setTimeout(() => {
    console.log('Send Server Info');
    exportServer?.updateServerInfo();
    exportServer?.updateStatus();
  }, 100);
};

// Stops the server and clears the memory
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
ipcMain.handle(ExportServerChannels.StopServer, () => stopServer());

// Restart server
ipcMain.handle(ExportServerChannels.RestartServer, async () => {
  try {
    exportServer && stopServer();
    setTimeout(async () => await startServer(), 1000);
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
