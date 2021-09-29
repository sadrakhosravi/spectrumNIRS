declare namespace api {
  function on(channel: any, func: any): any;
  function send(channel: any, ...args: any): any;
  function invoke(channel: any, ...args: any): any;
  function removeListener(channel: any, customFunction: any): any;
}
