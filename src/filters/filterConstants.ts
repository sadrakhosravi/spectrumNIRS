export enum CUTOFF_FREQUENCY {
  FC_5HZ = 5,
  FC_8HZ = 8,
  FC_10HZ = 10,
  FC_15HZ = 15,
  FC_20HZ = 20,
  FC_30HZ = 30,
  FC_40HZ = 40,
  FC_80HZ = 80,
}

export const lowpassFreq = [
  0.1, 0.2, 0.5, 1, 2, 3, 5, 8, 10, 15, 20, 30, 40, 80,
];
export const lowpassOrder = [1, 2, 3, 6, 8];
export const highpassFreq = [0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5];
export const highpassOrder = [1, 2, 3, 6, 8];
export const defaultLPCoef = {
  order: 6,
  characteristic: 'butterworth',
  Fs: 100,
  Fc: 5,
  preGain: false,
};
