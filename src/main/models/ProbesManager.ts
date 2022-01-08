import { getConnection, createQueryBuilder } from 'typeorm';
import { BrowserWindow, dialog } from 'electron';
import DatabaseError from './DatabaseError';
import Probes from 'db/entity/Probes';
import { devices } from '@electron/configs/devices';

export interface IProbe extends Probe {
  device: typeof devices[0];
}

export type Probe = Probes;

type CurrentProbe = {
  createdAt: string;
  gain: number;
  id: number;
  intensities: number[];
  isDefault: number;
  lastUpdate: string | null;
  name: string;
  preGain: string;
  samplingRate: number;
  device: typeof devices[0];
  updatedAt: string;
};

class ProbeManager {
  currentProbe: CurrentProbe | undefined;
  defaultProbeId: number | undefined;

  constructor() {
    this.currentProbe = undefined;
    this.defaultProbeId = 0;
  }

  /**
   * Sets the current probe of the `ProbeManager`
   */
  public getDefaultProbe = async () => {
    try {
      const currentProbe = (await this.getProbe()) as any;

      this.currentProbe = this.formatProbeData(currentProbe);

      console.log(this.currentProbe);
      this.defaultProbeId = this.currentProbe?.id;
    } catch (error) {
      new DatabaseError(error);
    }
  };

  /**
   * Gets the current application probe
   * @returns The current probe or undefined
   */
  public getCurrentProbe = () => this.currentProbe;

  /**
   * Gets all device.
   * @return an array containing all the available devices
   */
  public getAllDevices = async () => {
    return devices;
  };

  /**
   * Gets all probes of the given deviceId.
   * @return an array containing all the probes of the given deviceId
   */
  public getAllProbesOfDevice = async (deviceId: number) => {
    try {
      return await createQueryBuilder()
        .select()
        .from(Probes, '')
        .where('deviceId = :deviceId', { deviceId })
        .getRawMany();
    } catch (error: any) {
      new DatabaseError(error);
      return undefined;
    }
  };

  /**
   * Gets the current's probe intensities
   * @returns Current probe's intensities or an empty array if non found
   */
  public getIntensities = async (): Promise<object | undefined> => {
    return {
      intensities: this.currentProbe?.intensities,
      defaultIntensities: this.currentProbe?.device.defaultIntensities,
    };
  };

  /**
   * Saves the current probe's intensities in the database
   * @param intensities - Intensities
   */
  public setIntensities = async (intensities: number[]) => {
    if (this.currentProbe) {
      this.currentProbe.intensities = intensities;
      try {
        return await getConnection()
          .createQueryBuilder()
          .update(Probes)
          .set({
            //@ts-ignore
            intensities: `[${this.currentProbe.intensities.join(',')}]`,
          })
          .where('id = :id', { id: this.currentProbe.id })
          .execute();
      } catch (error) {
        new DatabaseError(error);
        return undefined;
      }
    }
    return;
  };

  /**
   * Sets the application default probe
   * @param probeId - The id of the new default probe
   * @returns
   */
  public setDefaultProbe = async (probeId: number) => {
    try {
      // Remove the current default probe
      await getConnection()
        .createQueryBuilder()
        .update(Probes)
        .where('id = :id', { id: this.currentProbe?.id })
        .set({ isDefault: 0 })
        .execute();

      // Set the default probe
      await getConnection()
        .createQueryBuilder()
        .update(Probes)
        .where('id = :id', { id: probeId })
        .set({ isDefault: 1 })
        .execute();

      await this.setDefaultProbeId();
    } catch (error) {
      new DatabaseError(error);
      return;
    }
  };

  /**
   * Gets the default probe from the database and sets the
   * defaultProbeId.
   */
  public setDefaultProbeId = async () => {
    const defaultProbe = await getConnection()
      .createQueryBuilder()
      .select()
      .from(Probes, '')
      .where('isDefault = :isDefault', { isDefault: 1 })
      .getRawOne<Probes>();

    this.defaultProbeId = defaultProbe ? defaultProbe.id : 1;
  };

  /**
   * Sets the current sensor of the application
   * @param probeId - The id of the probe to be set
   */
  public setCurrentProbe = async (probeId: number) => {
    try {
      const newProbe = await this.getProbe(probeId);

      this.currentProbe = this.formatProbeData(newProbe);

      return this.currentProbe;
    } catch (error) {
      new DatabaseError(error);
      return false;
    }
  };

  /**
   * Creates a new probe in the database and sets it in the application
   * @param data - New probe's data
   * @param sensorId - Probes sensor
   */
  public newProbe = async (data: any, sensorId: number) => {
    try {
      const newProbe = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Probes)
        .values([data, sensorId])
        .execute();

      this.setCurrentProbe(newProbe.raw);
    } catch (error) {
      new DatabaseError(error);
    }
  };

  /**
   * Deletes the probe from the database.
   * @param probeId - The id of the probe to be deleted
   */
  public deleteProbe = async (probeId: number) => {
    // Show confirmation
    const confirmation = dialog.showMessageBoxSync(
      BrowserWindow.getFocusedWindow() as BrowserWindow,
      {
        title: 'Deleting probe failed',
        message: 'Cannot delete the default probe.',
        detail: 'Please change the default probe before deleting this probe.',
        buttons: ['Confirm', 'Cancel'],
        defaultId: 1,
        noLink: true,
      }
    );

    // If the user confirms
    if (confirmation === 1) {
      // Check to see if the user is deleting the default probe
      if (probeId === this.defaultProbeId) {
        dialog.showMessageBoxSync(
          BrowserWindow.getFocusedWindow() as BrowserWindow,
          {
            title: 'Deleting probe failed',
            message: 'Cannot delete the default probe.',
            detail:
              'Please change the default probe before deleting this probe.',
          }
        );
        return;
      }
      try {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(Probes)
          .where('id = :id', { id: probeId })
          .execute();

        // If the deleted probe was the current probe,
        // set the default probe as the main probe
        if (probeId === this.currentProbe?.id) {
          this.getDefaultProbe();
        }
      } catch (error) {
        new DatabaseError(error);
      }
    }

    return;
  };

  /**
   * Gets the probe from the database base on probeId or default probe if id is not provided.
   * @param probeId - The id of the probe to query or undefined
   */
  private getProbe = async (probeId?: number) => {
    try {
      if (!probeId) {
        return (await createQueryBuilder(Probes, 'probes')
          .select()
          .where('probes.isDefault = :isDefault', { isDefault: 1 })
          .getOne()) as Probe;
      }
      return (await createQueryBuilder(Probes, 'probes')
        .select()
        .where('probes.id = :probeId', { probeId })
        .getOne()) as Probe;
    } catch (error) {
      new DatabaseError(error);
      return undefined;
    }
  };

  /**
   * Formats the queried data to useable arrays and numbers instead of strings
   * @param data - The queried probe data from the database
   * @returns
   */
  private formatProbeData = (data: any) => {
    data.intensities = JSON.parse(data.intensities);
    data.device = devices.find((device) => data.deviceId === device.id);

    // Sort intensities
    // data.intensities = data?.intensities
    //   .split(',')
    //   .map((item: any) => parseInt(item)) as number[];

    return data;
  };
}

export default ProbeManager;
