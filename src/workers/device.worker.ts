import { IGetDevice } from '@lib/Device/device-api';

// Devices
import V5 from '@electron/devices/device/V5';
import { Readable } from 'stream';
import AddTimeStamp from '@lib/Stream/AddTimeStamp';
import SendDataToUI from '@lib/Stream/SendDataToUI';
// import split2 from 'split2';

export interface IDeviceInfo {
  samplingRate: number;
  dataByteSize: number;
  batchSize: number;
  numOfElementsPerDataPoint: number;
}

class DeviceWorker {
  devices: IGetDevice[];
  selectedDevice: IGetDevice;
  port: MessagePort;

  constructor(port: MessagePort) {
    this.devices = [V5];
    this.selectedDevice = this.devices[0];
    this.port = port;
  }

  /**
   * Start
   */
  start = () => {
    const device = this.getSelectedDevice();

    const highWaterMark = device.Stream.getSampleBufferSize() * 25;

    // Start the parser and transformer streams
    const Parser = new device.Parser({
      highWaterMark: highWaterMark,
      readableHighWaterMark: highWaterMark,
      writableHighWaterMark: highWaterMark,
    });
    new AddTimeStamp({ highWaterMark: 1 });
    const SendData = new SendDataToUI(
      { highWaterMark: highWaterMark },
      this.port
    );

    // Start the device
    device.Device.startDevice();

    // Wait for the cold start
    setTimeout(() => {
      const deviceStream = device.Stream.getDeviceStream();
      if (deviceStream instanceof Readable) {
        deviceStream.pipe(Parser).pipe(SendData);
      }
    }, this.selectedDevice.Device.getStartupDelay());
  };

  /**
   * Stops the device an its stream
   */
  stop = () => {
    this.selectedDevice.Stream.stopDeviceStream();
    this.selectedDevice.Device.stopDevice();
  };

  /**
   * @returns an array of all the devices that are integrated in the app
   */
  public getDevices = () => this.devices.map((device) => device.Device);

  /**
   * @returns the selected device
   */
  public getSelectedDevice = () => this.selectedDevice;
}

let deviceWorker: DeviceWorker | undefined;

self.onmessage = (event) => {
  console.log(event);
  if (event.data === 'start') {
    deviceWorker = new DeviceWorker(event.ports[0]);
    deviceWorker.start();
  }

  if (event.data === 'stop') {
    deviceWorker?.stop();
    deviceWorker = undefined;
  }
};
