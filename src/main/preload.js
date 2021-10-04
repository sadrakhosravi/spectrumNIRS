const { ipcRenderer, contextBridge } = require('electron');
const electron = require('electron');

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
  send: ipcRenderer.send,
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  invoke: ipcRenderer.invoke,
  removeListener: ipcRenderer.removeListener,

  /* Window functions */
  minimize: () => ipcRenderer.send('window:minimize'),
  restore: () => ipcRenderer.send('window:restore'),
  close: () => ipcRenderer.send('window:close'),

  /* Record functions */
  sendRecordState: (state) => {
    ipcRenderer.send(`record:${state}`);
  },

  /* DB functions */
  // create a new experiment in the database
  createNewExperiment: async (data) => {
    return await ipcRenderer.invoke('db:new-experiment', data);
  },

  // get recent some number of recent experiments
  getRecentExperiments: async (numOfExperiments) => {
    return await ipcRenderer.invoke(
      'db:get-recent-experiments',
      numOfExperiments
    );
  },

  // get recording data from the database
  getRecording: () => {
    ipcRenderer.send('db:get-recordings');
  },

  /* IPC Renderer functions */
  removeNIRSDataListener: () => {
    ipcRenderer.removeAllListeners('data:nirs-reader');
    ipcRenderer.removeAllListeners('data:nirs-reader-review');
  },
});
