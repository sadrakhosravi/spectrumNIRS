import { createSlice } from '@reduxjs/toolkit';

/**
 * Determine the state of the app. Used to navigate to home, record, or review sections.
 */
export const AppStateSlice = createSlice({
  name: 'appState',
  initialState: {
    value: 'record', // Can be 'home', 'record', 'review' - Check app state enum
  },
  reducers: {
    changeAppState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeAppState } = AppStateSlice.actions;

export default AppStateSlice.reducer;
