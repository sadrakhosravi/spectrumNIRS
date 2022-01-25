import { Transform, TransformOptions, TransformCallback } from 'stream';

class Transformer extends Transform {
  constructor(options?: TransformOptions) {
    super(options);
  }

  _pushWithBackpressure(chunk: Buffer) {
    if (!this.push(chunk)) {
      this.once('drain', () => this._pushWithBackpressure(chunk));
    }
  }
}

export default Transformer;
export { TransformOptions as TransformerOptions };
export { TransformCallback as TransformerCallback };
