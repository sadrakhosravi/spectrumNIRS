declare namespace api {
  const ipcRenderer: any;
  function on(channel: any, func: any): any;
  function send(channel: any, ...args: any): any;
  function invoke(channel: any, ...args: any): any;
  function removeListener(channel: any, customFunction: any): any;

  /**
   * Returns the directory name
   */
  function dirname(): string;

  /**
   * Send an asynchronous message to the main process via `channel`, along with
   * arguments
   */
  function sendIPC(channel: string, args?: any | any[]): void;

  /**
   * Send a message to the main process via channel and expect a result synchronously.
   * This action will block the renderer process
   */
  function sendSyncIPC(channel: string, args?: any | any[]): any;

  /**
   * Send a message to the main process along with arguments via `channel` and expect a result
   * asynchronously
   */
  function invokeIPC(channel: string, args?: any | any[]): Promise<any>;

  /**
   * Listens to `channel`, when a new message arrives `listener` would be called with
   * `listener(event, args...)`.
   */
  function onIPCData(
    channel: string,
    listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void
  ): void;

  /**
   *Adds a one time listener function for the event. This listener is invoked only
   * the next time a message is sent to channel, after which it is removed.
   */
  function onceIPC(
    channel: string,
    listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void
  ): void;

  /**
   *  Removes all listeners, or those of the specified `channel`.
   */
  function removeListeners(channel: string): void;

  /**
   * Window functions
   */
  const window: {
    minimize: () => void;
    close: () => void;
    restore: () => void;
  };

  const dialog: {
    messageBox: (options: any) => Promise<any>;
  };

  // Record functions
  function sendRecordState(state: string, patientId?: number): void;
  function getRecordingData(func: (data: any) => void): void;

  // DB functions
  function getRecentExperiments(numOfExp: number): Promise<Array<Object>>;
  function createNewExperiment(data: Object): Promise<Boolean>;
  function getRecordingDataFromDB(): void;
  function getRecordingOnKeyDown(interval: object): Promise<Array<Object>>;

  // IPC Renderer Functions
  function removeChartEventListeners(): void;

  // Remove Event Listeners
  function removeHomePageEventListeners(): void;
  function removeRecentExperimentEventListeners(): void;

  // Experiment
  const experiment: {
    newExp: (expData: Object) => Promise<any>;
  };

  // Context menu
  const contextMenu: {
    reviewTab: () => void;
  };
}

// global.d.ts
declare module '*.css';

declare module 'typedarray-to-buffer';
declare module 'thread-stream';
