import { createSlice } from '@reduxjs/toolkit';

/**
 * Determine the state of the app. Used to navigate to home, record, or review sections.
 */
export const ExperimentDataSlice = createSlice({
  name: 'experimentData',
  initialState: {
    value: {}, // Will contain all the experiment information
  },
  reducers: {
    setExperimentData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setExperimentData } = ExperimentDataSlice.actions;

export default ExperimentDataSlice.reducer;
