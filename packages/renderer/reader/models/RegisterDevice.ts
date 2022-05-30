import { devices } from '../Devices/Devices';

// Services
import ServiceManager from '../../../services/ServiceManager';

/**
 * Registers the devices in the database and the the device modules.
 */
export class RegisterDevices {
  public static async registerInDB() {
    // Get all devices first
    const allDBDevice = await ServiceManager.dbConnection.deviceQueries.getAllDevices();
    console.log(allDBDevice);

    // If the device does not exist, register it.
    devices.forEach(async (device) => {
      const isDeviceInDb = allDBDevice.find((DBDevice) => DBDevice.name === device.name);

      // Register the device if its not in the db
      if (!isDeviceInDb) {
        const ts = Date.now();
        const deviceToAdd = {
          name: device.name,
          description: '',
          created_timestamp: ts,
          last_update_timestamp: ts,
          settings: null,
        };
        await ServiceManager.dbConnection.deviceQueries.addDevice(deviceToAdd);
      }
    });
  }
}

export default RegisterDevices;
