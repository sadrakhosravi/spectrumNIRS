import { createSlice } from '@reduxjs/toolkit';
import { devices } from '@electron/configs/devices';

export interface ISensorState {
  detectedSensor: typeof devices[0] | null;
  selectedSensor: typeof devices[0];
}

const initialState: ISensorState = {
  detectedSensor: null,
  selectedSensor: devices[0],
};

export const SensorSlice = createSlice({
  name: 'sensorState',
  initialState,
  reducers: {
    setDetectedSensor: (state, action) => {
      state.detectedSensor = action.payload;
    },
    setSelectedSensor: (state, action) => {
      state.selectedSensor = action.payload;
    },
    setSensorIntensities: (state, { payload }: { payload: number[] }) => {
      state.selectedSensor.intensities = payload;
    },
  },
});

export const { setDetectedSensor, setSelectedSensor, setSensorIntensities } =
  SensorSlice.actions;

export default SensorSlice.reducer;
