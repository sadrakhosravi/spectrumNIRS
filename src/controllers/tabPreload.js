const { ipcRenderer, contextBridge, ipcMain } = require('electron');

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
  ipcRenderer: (func) => {
    ipcRenderer.on('data:reader-record', (event, ...args) => func(...args));
  },
  sendIPC: (channel, args) => ipcRenderer.send(channel, args),
  getRecordingData: (func) => {
    ipcRenderer.on('data:reader-record', (event, ...args) => func(...args));
  },
});
