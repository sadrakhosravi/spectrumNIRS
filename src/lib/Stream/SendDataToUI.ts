import { Writable, WritableOptions } from 'stream';

class SendDataToUI extends Writable {
  port: MessagePort | undefined;
  constructor(options?: WritableOptions, port?: MessagePort) {
    super(options);
    this.port = port;
  }

  _write(
    _chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    new Uint16Array(_chunk.buffer);

    //@ts-ignore
    _chunk = null;
    callback();
  }
}

export default SendDataToUI;
