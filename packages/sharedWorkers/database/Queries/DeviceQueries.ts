import { Queries } from './Queries';

// Types
import type { DatabaseConnectionType, BetterSqlite3 } from '../types/Types';

export type DeviceDBDataType = {
  name: string;
  description: string | null;
  created_timestamp: number;
  last_update_timestamp: number;
  /**
   * JSON.stringified version of settings. Use JSON.parse
   */
  settings: string | null;
};

export class DeviceQueries extends Queries {
  private addDeviceStmt: BetterSqlite3.Statement<any[]>;
  private getAllDevicesStmt: BetterSqlite3.Statement<any[]>;

  constructor(connection: DatabaseConnectionType) {
    super(connection);

    // Insert new device
    this.addDeviceStmt = this.connection.prepare(
      'INSERT INTO devices (name, description, created_timestamp, last_update_timestamp, settings) VALUES (@name, @description, @created_timestamp, @last_update_timestamp, @settings)',
    );

    // Get all devices
    this.getAllDevicesStmt = this.connection.prepare('SELECT * from devices');
  }

  /**
   * @returns an array of all the devices available in the database.
   */
  public getAllDevices(): DeviceDBDataType[] {
    return this.getAllDevicesStmt.all();
  }

  public addDevice(device: DeviceDBDataType) {
    this.addDeviceStmt.run(device);
  }
}
