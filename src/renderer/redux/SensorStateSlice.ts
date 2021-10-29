import { createSlice } from '@reduxjs/toolkit';

export interface ISensor {
  id: number;
  name: string;
  samplingRate: number;
  channels: string[];
  driverName: string;
}

export interface ISensorState {
  detectedSensor: ISensor | false;
  selectedSensor: ISensor | false;
}

const initialState: ISensorState = {
  detectedSensor: false,
  selectedSensor: false,
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
  },
});

export const { setDetectedSensor, setSelectedSensor } = SensorSlice.actions;

export default SensorSlice.reducer;
