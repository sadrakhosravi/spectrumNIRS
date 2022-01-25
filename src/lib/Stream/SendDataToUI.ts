import { Duplex, DuplexOptions } from 'stream';
import { BrowserWindow, WebContents } from 'electron';

class SendDataToUI extends Duplex {
  data: number[][];
  count: number;
  mainWindow!: WebContents;

  constructor(options?: DuplexOptions) {
    super(options);
    this.data = [];
    this.count = 0;

    setTimeout(() => {
      this.mainWindow = BrowserWindow.getAllWindows()[0]
        .webContents as WebContents;
    }, 50);
  }

  _read(_size: number): void {}

  _write(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (this.count === 3) {
      this.mainWindow.send('device:data', this.data);
      this.data.length = 0;
      this.count = 0;
    }

    const data = new Float32Array(chunk.buffer);
    const rawData = [data[6], data[7], data[8], data[9], data[10]];
    this.data.push(rawData);
    this.count += 1;

    callback();
  }
}

export default SendDataToUI;
