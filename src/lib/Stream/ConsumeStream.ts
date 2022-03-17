import { Writable, WritableOptions } from 'stream';

class ConsumeStream extends Writable {
  constructor(options?: WritableOptions) {
    super(options);
  }

  _write(
    _chunk: any,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    callback();
  }
}

export default ConsumeStream;
