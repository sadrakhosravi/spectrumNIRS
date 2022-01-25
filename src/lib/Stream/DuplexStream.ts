import { Duplex, DuplexOptions } from 'stream';

class DuplexStream extends Duplex {
  constructor(options?: DuplexOptions) {
    super(options);
  }

  _pushWithBackpressure(chunk: Buffer | String | Uint8Array) {
    if (!this.push(chunk)) {
      this.once('drain', () => this._pushWithBackpressure(chunk));
    }
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
