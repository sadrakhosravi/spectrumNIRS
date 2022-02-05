import { Writable, WritableOptions } from 'stream';

class SendDataToUI extends Writable {
  port: MessagePort;
  constructor(options: WritableOptions, port: MessagePort) {
    super(options);
    this.port = port;
  }

  _write(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.port.postMessage(chunk, { transfer: [chunk.buffer] });
    // console.log(chunk);
    //@ts-ignore
    callback();
  }
}

export default SendDataToUI;
