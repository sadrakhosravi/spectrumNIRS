import { DeviceDataType } from '@electron/models/DeviceReader/DeviceDataTypes';
import GlobalStore from '@lib/globalStore/GlobalStore';
import Fili from 'fili';

// Cache the filters to prevent bounce on pause/continue
const lowpassFilters: any[] = [];
const highpassFilters: any[] = [];

let lastSettings: ILiveFilter = {
  Fs: null,
  lowpass: {
    Fc: null,
    order: null,
  },
  highpass: {
    Fc: null,
    order: null,
  },
};
export let defaultSettings: ILiveFilter = {
  Fs: 100,
  lowpass: {
    Fc: 5,
    order: 6,
  },
  highpass: {
    Fc: null,
    order: null,
  },
};

GlobalStore.setLiveFilterState('lowpass', defaultSettings.lowpass);
GlobalStore.setLiveFilterState('highpass', defaultSettings.highpass);

export interface ILiveFilter {
  Fs?: number | null;
  lowpass: {
    Fc: number | null;
    order: number | null;
  };
  highpass: {
    Fc: number | null;
    order: number | null;
  };
}

class LiveFilter {
  private numOfChannels: number;
  private iirCalculator: any;

  constructor(numOfADCChannels: number) {
    this.numOfChannels = numOfADCChannels;
    this.iirCalculator = new Fili.CalcCascades();
  }

  public filterData(_data: DeviceDataType[]) {
    let data: any[] = _data;
    if (highpassFilters.length > 0) data = this.applyHighpass(_data);
    if (lowpassFilters.length > 0) this.applyLowpass(data);

    return data;
  }

  private applyLowpass(data: DeviceDataType[]) {
    const dataLength = data.length;

    for (let i = 0; i < dataLength; i += 1) {
      const filteredValues = new Array(this.numOfChannels + 1).fill(0);

      for (let j = 0; j < this.numOfChannels + 1; j += 1) {
        filteredValues[j] = lowpassFilters[j].singleStep(data[i].ADC1[j]);
      }
      data[i].ADC1 = filteredValues;
    }

    return data;
  }

  private applyHighpass(data: DeviceDataType[]) {
    const dataLength = data.length;

    for (let i = 0; i < dataLength; i += 1) {
      const filteredValues = new Array(this.numOfChannels + 1).fill(0);

      for (let j = 0; j < this.numOfChannels + 1; j += 1) {
        filteredValues[j] = highpassFilters[j].singleStep(data[i].ADC1[j]);
      }
      data[i].ADC1 = filteredValues;
    }

    return data;
  }

  /**
   * Creates the lowpass filers for each PD channel
   */
  public createLowpassFilters(Fs: number, Fc: number, order?: number) {
    // Check if filter exists
    if (
      Fs === lastSettings.Fs &&
      Fc === lastSettings.lowpass.Fc &&
      order === lastSettings.lowpass.order
    )
      return;

    if (!Fc || !order) {
      console.log('REMOVED LOWPASS');
      lowpassFilters.length = 0;
      lastSettings.lowpass.Fc = null;
      lastSettings.lowpass.order = null;
      GlobalStore.setLiveFilterState('lowpass', lastSettings.lowpass);

      return;
    }

    lowpassFilters.length = 0;

    for (let i = 0; i < this.numOfChannels + 1; i += 1) {
      const lowPassFilterCoef = this.iirCalculator.lowpass({
        characteristic: 'butterworth',
        preGain: false,
        order: order || 6,
        Fs,
        Fc: Fc || 5,
      });
      const filter = new Fili.IirFilter(lowPassFilterCoef);

      lowpassFilters.push(filter);
    }

    // Save last settings
    lastSettings.Fs = Fs;
    lastSettings.lowpass.Fc = Fc;
    lastSettings.lowpass.order = order || 6;

    console.log('NEW LOWPASS FILTERS created');
    console.log(lastSettings);

    GlobalStore.setLiveFilterState('lowpass', lastSettings.lowpass);
  }

  /**
   * Creates the lowpass filers for each PD channel
   */
  public createHighpassFilters(Fs: number, Fc: number, order?: number) {
    // Check if filter exists
    if (
      Fs === lastSettings.Fs &&
      Fc === lastSettings.highpass.Fc &&
      order === lastSettings.highpass.order
    )
      return;

    if (!Fc || !order) {
      console.log('REMOVED HIGHPASS');
      lastSettings.highpass.Fc = null;
      lastSettings.highpass.order = null;
      GlobalStore.setLiveFilterState('highpass', lastSettings.highpass);

      highpassFilters.length = 0;
      return;
    }

    highpassFilters.length = 0;

    for (let i = 0; i < this.numOfChannels + 1; i += 1) {
      const lowPassFilterCoef = this.iirCalculator.highpass({
        characteristic: 'butterworth',
        preGain: false,
        order: order || 6,
        Fs,
        Fc: Fc || 5,
      });
      const filter = new Fili.IirFilter(lowPassFilterCoef);

      highpassFilters.push(filter);
    }

    // Save last settings
    lastSettings.Fs = Fs;
    lastSettings.highpass.Fc = Fc;
    lastSettings.highpass.order = order || 6;

    console.log('NEW HIGHPASS FILTERS created');
    console.log(lastSettings);

    GlobalStore.setLiveFilterState('highpass', lastSettings.highpass);
  }
}

export default LiveFilter;
