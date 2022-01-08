import { createSlice } from '@reduxjs/toolkit';
import { devices } from '@electron/configs/devices';

export type CurrentProbe = {
  createdAt: string;
  gain: number;
  id: number;
  intensities: string;
  isDefault: number;
  lastUpdate: string | null;
  name: string;
  preGain: string;
  samplingRate: number;
  device: typeof devices[0];
  updatedAt: string;
};

export interface ISensorState {
  detectedSensor: typeof devices[0] | null;
  currentProbe: null | CurrentProbe;
}

const initialState: ISensorState = {
  detectedSensor: null,
  currentProbe: null,
};

export const SensorSlice = createSlice({
  name: 'sensorState',
  initialState,
  reducers: {
    setDetectedSensor: (state, action) => {
      state.detectedSensor = action.payload;
    },
    setCurrentProbe: (state, { payload }: { payload: CurrentProbe }) => {
      console.log(payload);
      state.currentProbe = payload;
    },
  },
});

export const { setDetectedSensor, setCurrentProbe } = SensorSlice.actions;

export default SensorSlice.reducer;
