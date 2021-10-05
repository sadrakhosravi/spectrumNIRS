declare namespace api {
  function on(channel: any, func: any): any;
  function send(channel: any, ...args: any): any;
  function invoke(channel: any, ...args: any): any;
  function removeListener(channel: any, customFunction: any): any;

  // Window functions
  function minimize(): void;
  function restore(): void;
  function close(): void;

  // Record functions
  function sendRecordState(state: string): void;

  // DB functions
  function getRecentExperiments(numOfExp: number): Promise<Array<Object>>;
  function createNewExperiment(data: Object): Promise<Boolean>;
  function getRecording(): void;
  function getRecordingOnKeyDown(interval: object): Promise<Array<Object>>;

  // IPC Renderer Functions
  function removeNIRSDataListener(): void;
}
