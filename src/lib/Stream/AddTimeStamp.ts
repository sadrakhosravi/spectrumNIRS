import { Transform, TransformCallback, TransformOptions } from 'stream';
// import TimeStampGenerator from '../Device/TimeStampGenerator';

class AddTimeStamp extends Transform {
  chunks: any[];
  count: number;
  constructor(options?: TransformOptions) {
    super(options);

    this.chunks = [];
    this.count = 0;
  }

  _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    next: TransformCallback
  ): void {
    console.log(chunk.toString());

    this.push(chunk);
    next();
  }
}

export default AddTimeStamp;
