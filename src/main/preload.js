const { ipcRenderer, contextBridge } = require('electron');

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
  send: ipcRenderer.send,
  on: ipcRenderer.on,
  invoke: ipcRenderer.invoke,
  removeListener: ipcRenderer.removeListener,
});
