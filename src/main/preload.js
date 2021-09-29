const { ipcRenderer, contextBridge } = require('electron');

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
  send: ipcRenderer.send,
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  invoke: ipcRenderer.invoke,
  removeListener: ipcRenderer.removeListener,
});
