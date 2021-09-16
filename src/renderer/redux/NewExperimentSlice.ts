import { createSlice } from '@reduxjs/toolkit';

/**
 * Determine the state of the app. Used to navigate to home, record, or review sections.
 */
export const NewExperimentSlice = createSlice({
  name: 'newExperiment',
  initialState: {
    value: false, // Can be true or false
  },
  reducers: {
    setIsNewExperiment: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setIsNewExperiment } = NewExperimentSlice.actions;

export default NewExperimentSlice.reducer;
