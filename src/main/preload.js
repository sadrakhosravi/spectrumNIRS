const { ipcRenderer, contextBridge } = require('electron');

// Adds an object 'api' to the global window object:
window.api = {
  dirname: () => __dirname,
  // Send channels
  sendIPC: (channel, args) => ipcRenderer.send(channel, args),
  sendSyncIPC: (channel, args) => ipcRenderer.sendSync(channel, args),
  invokeIPC: (channel, args) => ipcRenderer.invoke(channel, args),

  // Receive channels
  onIPCData: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
  onceIPC: (channel, func) =>
    ipcRenderer.once(channel, (event, ...args) => func(event, ...args)),

  // Remove Listeners
  removeListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  /* Window functions */
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    restore: () => ipcRenderer.send('window:restore'),
    close: () => ipcRenderer.send('window:close'),
  },

  dialog: {
    messageBox: (options) => dialog.showMessageBox(null, options),
  },

  // Context menu events
  contextMenu: {
    reviewTab: () => ipcRenderer.send('context-menu', 'review'),
  },

  // Experiment related events
  experiment: {
    newExp: async (expData) =>
      await ipcRenderer.invoke(`experiment:newExp`, expData),
    newPatient: async (expData) =>
      await ipcRenderer.invoke(`experiment:new`, expData),
  },
};
