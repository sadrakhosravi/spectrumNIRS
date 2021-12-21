import { getConnection } from 'typeorm';
import { Probes } from 'db/entity/Probes';

export class ProbesManager {
  currentProbeId: number;

  constructor() {
    this.currentProbeId = 1;
  }

  /**
   * Creates a new probe in the database
   * @param data - New intensities array
   * @returns the newly created probe object
   */
  newProbe = async (data: any) => {
    try {
      const _newProbe = new Probes();
      Object.assign(_newProbe, data);
      const newProbe = await _newProbe.save();

      return newProbe;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Gets the current probe intensity from the database
   * @returns
   */
  getIntensities = async () => {
    try {
      const probe = await getConnection()
        .createQueryBuilder()
        .select()
        .from(Probes, '')
        .where('id = :id', { id: this.currentProbeId })
        .getRawOne<Probes>();

      if (probe) {
        const defaultIntensities = probe.defaultIntensities
          .split(',')
          .map((intensity) => parseInt(intensity));
        const savedIntensities = probe.savedIntensities
          ?.split(',')
          .map((intensity) => parseInt(intensity));

        const LEDs = probe.LEDs.split(',');

        return { defaultIntensities, savedIntensities, LEDs };
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Update the current probe intensity
   * @param intensities - New intensities array
   * @returns
   */
  updateIntensities = async (intensities: number[] | string[]) => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .update(Probes)
        .set({ savedIntensities: intensities.join(',') })
        .where('id = :id', { id: this.currentProbeId })
        .execute();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}

export default ProbesManager;
