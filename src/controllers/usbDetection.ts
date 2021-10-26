import { ipcMain, BrowserWindow } from 'electron';
import usbDetect from 'usb-detection';

import { USBDetectionChannels } from '../utils/channels';

// Starts listening for insert/remove events of USB devices.
usbDetect.startMonitoring();

// Detect USB insert
usbDetect.on('add', function (device: any) {
  if (device.deviceName.includes('STM32')) {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    mainWindow.webContents.send(USBDetectionChannels.NIRSV5, true);
  }
});

// Detect USB insert
usbDetect.on('remove', function (device: any) {
  if (device.deviceName.includes('STM32')) {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    mainWindow.webContents.send(USBDetectionChannels.NIRSV5, false);
  }
});

// Look for the sensor in the connected devices list
ipcMain.handle(USBDetectionChannels.CHECK_USB, async () => {
  const USBDevices = await usbDetect.find();
  console.log(USBDevices);
  const checkForNIRSV5 = USBDevices.filter((device) =>
    device.deviceName.includes('STM32')
  );
  const result = checkForNIRSV5.length > 0 ? true : false;
  return result;
});
