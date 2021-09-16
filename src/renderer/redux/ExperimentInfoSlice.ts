import { createSlice } from '@reduxjs/toolkit';

/**
 * Determine the state of the app. Used to navigate to home, record, or review sections.
 */
export const ExperimentInfoSlice = createSlice({
  name: 'experimentInfo',
  initialState: {
    value: false, // All the input values from New Experiment form || false
  },
  reducers: {
    setExperimentInfo: (state, action) => {
      state.value = action.payload;
      console.log(action.payload);
    },
  },
});

export const { setExperimentInfo } = ExperimentInfoSlice.actions;

export default ExperimentInfoSlice.reducer;
