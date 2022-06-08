// Tables
import { DevicesTable } from '../Tables/DevicesTable';

import type { DataSource } from 'typeorm';
import type { IDeviceConfig, IDeviceConfigParsed } from '../../../renderer/reader/Interfaces';
import { DeviceConfigsTable } from '../Tables/DeviceConfigsTable';

export type DeviceInfoType = {
  id: number;
  name: string;
  description: string | null;
  /**
   * JSON stringified version of the device settings.
   */
  settings: null | string;
  /**
   * Unix timestamp
   */
  created_timestamp: number;
  /**
   * Unix timestamp
   */
  updated_timestamp: number;
};

export type DeviceToAddType = {
  id: number;
  name: string;
  description: string | null;
  settings: null | Blob;
};

export type DeviceConfigsType = IDeviceConfig & {
  created_timestamp: number;
  updated_timestamp: number;
  deviceId: number;
};

export class DeviceQueries {
  private dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  /**
   * @returns the device from the database that has the given id.
   */
  public async selectDevice(id: number) {
    const device = await this.dataSource
      .getRepository(DevicesTable)
      .createQueryBuilder('devices')
      .leftJoinAndSelect('devices.configs', 'configs')
      .where(`devices.id = ${id}`)
      .getOne();

    return device;
  }

  /**
   * @returns all the devices from the database.
   */
  public async selectAllDevices() {
    return (await this.dataSource
      .createQueryBuilder()
      .select()
      .from(DevicesTable, '')
      .getRawMany()) as DeviceInfoType[];
  }

  /**
   * @returns all configs of the given deviceId.
   */
  public async selectAllDeviceConfigs(deviceId: number) {
    const configs = await this.dataSource
      .createQueryBuilder()
      .select()
      .from(DeviceConfigsTable, '')
      .where(`deviceId = ${deviceId}`)
      .getMany();

    return configs;
  }

  /**
   * @returns the parsed active device configuration or null from the database.
   */
  public async selectActiveDeviceConfig(deviceId: number) {
    const activeConfig = await this.dataSource
      .createQueryBuilder()
      .select()
      .from(DeviceConfigsTable, '')
      .where(`deviceId = ${deviceId}`)
      .andWhere('is_active = 1')
      .getRawOne();

    if (activeConfig?.settings) {
      activeConfig.settings = JSON.parse(activeConfig.settings as string);
    }

    return activeConfig as (DeviceConfigsType & { id: number }) | null;
  }

  /**
   * Inserts the given configuration in the database.
   */
  public async insertConfig(config: IDeviceConfig, deviceId: number, isConfigActive?: boolean) {
    const ts = Date.now();

    // Stringify the config for db insert
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(DeviceConfigsTable)
      .values({
        name: config.name,
        description: config.description,
        created_timestamp: ts,
        updated_timestamp: ts,
        settings: JSON.stringify(config.settings),
        device: deviceId,
        is_active: isConfigActive ? 1 : 0,
      })
      .execute();
  }

  /**
   * Updates the config of with the given config id.
   */
  public async updateConfig(config: IDeviceConfigParsed, configId: number) {
    const updated = await this.dataSource
      .createQueryBuilder()
      .update(DeviceConfigsTable)
      .set({ settings: JSON.stringify(config), updated_timestamp: Date.now() })
      .where(`id = ${configId}`)
      .execute();

    return updated;
  }

  /**
   * Creates a new recording in the database.
   */
  public async insertDevice(device: DeviceToAddType) {
    // Add timestamp.
    const ts = Date.now();

    const created = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(DevicesTable)
      .values({ created_timestamp: ts, updated_timestamp: ts, ...device })
      .execute();

    return await this.selectDevice(created.raw);
  }
}
