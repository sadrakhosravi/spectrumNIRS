import { Duplex, DuplexOptions } from 'stream';

class DuplexStream extends Duplex {
  constructor(options?: DuplexOptions) {
    super(options);
  }

  _write(
    _chunk: any,
    _encoding: BufferEncoding,
    next: (error?: Error | null) => void
  ): void {
    next();
  }

  _read(_size: number): void {}
}

export default DuplexStream;
export { DuplexOptions as DuplexStreamOptions };
