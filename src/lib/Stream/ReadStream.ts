import { Writable, WritableOptions } from 'stream';

class ReadStream extends Writable {
  constructor(options?: WritableOptions) {
    super(options);
  }

  _read(_size: number): void {}
}

export default ReadStream;
