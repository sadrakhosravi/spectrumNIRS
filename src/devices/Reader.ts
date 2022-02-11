import { IGetDevice } from '@lib/Device/device-api';

// Devices
import V5 from 'devices/V5/V5';
// import { Readable } from 'stream';
import AddTimeStamp from '@lib/Stream/AddTimeStamp';
// import SendDataToUI from '@lib/Stream/SendDataToUI';

export interface IDeviceInfo {
  samplingRate: number;
  dataByteSize: number;
  batchSize: number;
  numOfElementsPerDataPoint: number;
  channels: string[];
}

class Reader {
  devices: IGetDevice[];
  selectedDevice: IGetDevice;

  constructor() {
    this.devices = [V5];
    this.selectedDevice = this.devices[0];
    this.start(null);
  }

  start = (_port: MessagePort | any) => {
    this.getSelectedDevice();

    // Start the parser and transformer streams
    // const Parser = new device.Parser({ highWaterMark: 2 * 1024 });
    new AddTimeStamp({ highWaterMark: 1 });
    // const SendData = new SendDataToUI({ highWaterMark: 1024 * 2 }, port);

    // Start the device
    // device.Device.startDevice();

    // Wait for the cold start
    setTimeout(() => {
      // const deviceStream = device.Stream.getDeviceStream();
      // if (deviceStream instanceof Readable) {
      //   deviceStream.on('data', (data) => {
      //     console.log(data.toString());
      //   });
      // }
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
   * Create the shared data arrays to be sent to the parent process
   */

  /**
   * @returns an array of all the devices that are integrated in the app
   */
  public getDevices = () => this.devices.map((device) => device.Device);

  /**
   * @returns the selected device
   */
  public getSelectedDevice = () => this.selectedDevice;
}

export default new Reader();
export interface IReader extends Reader {}
