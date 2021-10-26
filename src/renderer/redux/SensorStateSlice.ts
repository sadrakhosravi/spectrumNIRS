import { createSlice } from '@reduxjs/toolkit';
import { Sensors } from '@utils/constants';

export type SensorState = {
  detectedSensor: Sensors | '';
  selectedSensor: Sensors | '';
};

const initialState: SensorState = {
  detectedSensor: '',
  selectedSensor: '',
};

export const SensorSlice = createSlice({
  name: 'sourceState',
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
