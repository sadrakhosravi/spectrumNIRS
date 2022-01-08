import { ipcMain, BrowserWindow } from 'electron';
import usbDetect from 'usb-detection';
import { devices } from '@electron/configs/devices';
import { USBDetectionChannels } from '../utils/channels';

// Starts listening for insert/remove events of USB devices.
usbDetect.startMonitoring();

/**
 * Checks the hardware devices to match any of the available sensor device
 * @param device
 * @returns - The first available device.
 */
const checkConnectedDevice = async (
  device: any
): Promise<null | typeof devices[0]> => {
  // If the device is not available return null.
  if (!device) return null;

  // Check if any of the sensors are available in the list.
  const connectedDevices = devices.filter((availableDevice) =>
    availableDevice.driverName.includes(device.deviceName.split(' ')[0])
  );

  // If any sensor is available, return the first one.
  const availableDevices =
    connectedDevices.length === 0 ? null : connectedDevices[0];

  // TODO: Available devices should return all the available device
  // not just the first one.
  return availableDevices;
};

/**
 * Sends the device status to every available page
 * @param deviceStatus Status of the device to be sent
 */
const sendDataToUI = (deviceStatus: null | typeof devices[0]) => {
  // Send the result to the UI.
  const windows = BrowserWindow.getAllWindows();
  windows.forEach((window) => {
    window.webContents.send(USBDetectionChannels.NIRSV5, deviceStatus);
  });
};

// Detect USB insert
usbDetect.on('add', async (device: any) => {
  // Check if the connected device is a sensor.
  const deviceStatus = await checkConnectedDevice(device);

  // Send the result to the UI.
  sendDataToUI(deviceStatus);
});

// Detect USB insert
usbDetect.on('remove', async (device: any) => {
  // Check if the removed device is a sensor.
  const deviceStatus = await checkConnectedDevice(device);
  const isNIRSV5 = deviceStatus ? null : deviceStatus;
  // Send the result to the UI.
  sendDataToUI(isNIRSV5);
});

// Look for the sensor in the connected devices list.
ipcMain.handle(USBDetectionChannels.CHECK_USB, async () => {
  // Get all the connected devices.
  const USBDevices = await usbDetect.find();
  console.log('Check for USB');

  // TODO: Make this function dynamic so that it checks all available sensors.
  // Check if NIRSV5 is available in the list.
  const checkForNIRSV5 = USBDevices.filter((device) =>
    device.deviceName.includes('STM32')
  );

  // Check if the device is connected and send the result.
  return await checkConnectedDevice(checkForNIRSV5[0]);
});
