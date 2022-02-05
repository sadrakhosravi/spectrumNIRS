import V5Calculation from '@electron/devices/device/V5Calculation';
import { IDeviceInfo } from '@electron/devices/Reader';

class Calculation {
  deviceCalc: V5Calculation;
  deviceInfo: IDeviceInfo;

  constructor(deviceInfo: IDeviceInfo) {
    this.deviceCalc = new V5Calculation();
    this.deviceInfo = deviceInfo;
  }

  public listenForIncomingData = (port: MessagePort) => {
    port.onmessage = (_event) => {
      // this.deviceCalc.processRawData(event.data, this.deviceInfo.batchSize);
      // const data = this.deviceCalc.processRawData(
      //   event.data,
      //   this.deviceInfo.batchSize
      // );
      // port.postMessage(data);
      // self.postMessage(data);
      console.log(_event.data);
    };
  };
}

// Listen for messages from the renderer process
self.onmessage = (event) => {
  console.log(event);
  const calculation = new Calculation(event.data.deviceInfo);
  calculation.listenForIncomingData(event.ports[0]);
  console.log('CreatedMessage');
};
