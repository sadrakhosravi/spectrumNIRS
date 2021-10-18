declare namespace api {
  function on(channel: any, func: any): any;
  function send(channel: any, ...args: any): any;
  function invoke(channel: any, ...args: any): any;
  function removeListener(channel: any, customFunction: any): any;

  /**
   * Send an asynchronous message to the main process via `channel`, along with
   * arguments
   */
  function sendIPC(channel: string, args?: any | any[]): void;

  /**
   * Send a message to the main process along with arguments via `channel` and expect a result
   * asynchronously
   */
  function invokeIPC(channel: string, args: any[]): Promise<any>;

  /**
   * Listens to `channel`, when a new message arrives `listener` would be called with
   * `listener(event, args...)`.
   */
  function onIPCData(
    channel: string,
    listener: (event: Electron.IpcRendererEvent, args: any[]) => void
  ): void;

  /**
   *  Removes all listeners, or those of the specified `channel`.
   */
  function removeAllListeners(channel: string): void;

  // Window functions
  const window: {
    minimize: () => void;
    close: () => void;
    restore: () => void;
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
