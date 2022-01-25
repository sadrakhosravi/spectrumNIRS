import { IGetDevice } from '@lib/Device/device-api';

// Devices
import V5 from '@electron/devices/device/V5';
import { Readable } from 'stream';
import AddTimeStamp from '@lib/Stream/AddTimeStamp';
// import ConsumeStream from '@lib/Stream/ConsumeStream';
import SendDataToUI from '@lib/Stream/SendDataToUI';
// import AddTimeStamp from '../Stream/AddTimeStamp';

class Reader {
  devices: IGetDevice[];
  selectedDevice: IGetDevice;

  constructor() {
    this.devices = [V5];
    this.selectedDevice = this.devices[0];
    this.start();
  }

  start = () => {
    const device = this.getSelectedDevice();
    const Parser = new device.Parser({ highWaterMark: 10024 });
    new AddTimeStamp({ highWaterMark: 10024 });
    const SendData = new SendDataToUI({ highWaterMark: 10024 });

    device.Device.startDevice();
    setTimeout(() => {
      const deviceStream = device.Stream.getDeviceStream();
      if (deviceStream instanceof Readable) {
        deviceStream.pipe(Parser).pipe(SendData);
      }
    }, this.selectedDevice.Device.getStartupDelay());
  };

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
