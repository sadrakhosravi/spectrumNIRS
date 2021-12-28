import { getConnection } from 'typeorm';
import Probes from 'db/entity/Probes';
import DatabaseError from './DatabaseError';

class ProbeManager {
  currentProbeId: number;
  constructor(probeId: number) {
    this.currentProbeId = probeId;
  }

  /**
   * Gets the current's probe intensities
   * @returns Current probe's intensities or an empty array if non found
   */
  getIntensities = async (): Promise<object | undefined> => {
    try {
      const probeConfigs = await getConnection()
        .createQueryBuilder()
        .select(['sensors.LEDs', 'intensities', 'defaultIntensities'])
        .from(Probes, '')
        .leftJoin('sensors', 'sensors')
        .where('probes.id = :id', { id: this.currentProbeId })
        .getRawOne();

      return {
        intensities: probeConfigs.intensities
          .split(',')
          .map((item: any) => parseInt(item)),
        defaultIntensities: probeConfigs.defaultIntensities
          .split(',')
          .map((item: any) => parseInt(item)),
      };
    } catch (error) {
      new DatabaseError(error);
      return undefined;
    }
  };

  /**
   * Saves the current probe's intensities in the database
   * @param intensities - Intensities
   */
  updateIntensity = async (intensities: number[]) => {
    try {
      return await getConnection()
        .createQueryBuilder()
        .update(Probes)
        .set({ intensities: intensities.join(',') })
        .where('id = :id', { id: this.currentProbeId })
        .execute();
    } catch (error) {
      new DatabaseError(error);
      return undefined;
    }
  };

  setCurrentProbe = async () => {};
}

export default ProbeManager;
