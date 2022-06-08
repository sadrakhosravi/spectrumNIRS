import { devices } from '../Devices/Devices';

// Services
import ServiceManager from '../../../services/ServiceManager';

/**
 * Registers the devices in the database and the the device modules.
 */
export class RegisterDevices {
  /**
   * Register all devices that the records are not in the database.
   */
  public static async registerInDB() {
    // Get all devices first
    const allDBDevice = await ServiceManager.dbConnection.deviceQueries.selectAllDevices();

    // If the device does not exist, register it.
    devices.forEach(async (device) => {
      const isDeviceInDb = allDBDevice.find((DBDevice) => DBDevice.name === device.name);
      // Register the device if its not in the db
      if (!isDeviceInDb) {
        const deviceToAdd = {
          id: device.id,
          name: device.name,
          description: '',
          settings: null,
        };
        await ServiceManager.dbConnection.deviceQueries.insertDevice(deviceToAdd);
      }
    });
  }

  /**
   * Registers all device default probes that are not available in the database.
   */
  public async registerProbesInDB() {}
}

export default RegisterDevices;
