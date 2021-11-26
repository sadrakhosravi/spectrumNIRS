import { BrowserWindow } from 'electron';

import { devices } from '@electron/configs/devices';
import usb from 'usb';
import { USBDetectionChannels } from '@utils/channels';

type ConnectedDevice = {
  id: number;
  name: string;
  samplingRate: number;
  channels: string[];
  driverName: string;
};

const checkConnectedDevice = (device: any): null | ConnectedDevice => {
  // If the device is not available return null.
  if (!device) return null;

  // Check if any of the sensors are available in the list.
  const connectedSensor = devices.filter((sensor) =>
    sensor.driverName?.includes(device.deviceName.split(' ')[0])
  );

  // If any sensor is available, return the first one.
  const availableSensor =
    connectedSensor.length === 0 ? null : connectedSensor[0];

  console.log(availableSensor);
  return availableSensor;
};

/**
 * Sends the sensor status to every available page
 * @param sensorStatus Status of the sensor to be sent
 */
const sendDataToUI = (sensorStatus: null | ConnectedDevice) => {
  // Send the result to the UI.
  const windows = BrowserWindow.getAllWindows();
  windows.forEach((window) => {
    window.webContents.send(USBDetectionChannels.NIRSV5, sensorStatus);
  });
};

// Detect USB insert
usb.on('add', function (device: any) {
  console.log(device);
  // Check if the connected device is a sensor.
  const sensorStatus = checkConnectedDevice(device);

  // Send the result to the UI.
  sendDataToUI(sensorStatus);
});

// Detect USB insert
usb.on('remove', function (device: any) {
  // Check if the removed device is a sensor.
  const sensorStatus = checkConnectedDevice(device);
  const isNIRSV5 = sensorStatus ? null : sensorStatus;

  // Send the result to the UI.
  sendDataToUI(isNIRSV5);
});

// Look for the sensor in the connected devices list.
// ipcMain.handle(USBDetectionChannels.CHECK_USB, async () => {
//   // Get all the connected devices.
//   const USBDevices = await usb.find();
//   console.log('Check for USB');

//   // TODO: Make this function dynamic so that it checks all available sensors.
//   // Check if NIRSV5 is available in the list.
//   const checkForNIRSV5 = USBDevices.filter((device) =>
//     device.deviceName.includes('STM32')
//   );

//   // Check if the device is connected and send the result.
//   const sensorStatus = checkConnectedDevice(checkForNIRSV5[0]);
//   console.log(sensorStatus);
//   return sensorStatus;
// });
