import { createSlice } from '@reduxjs/toolkit';

export const AppStateSlice = createSlice({
  name: 'appState',
  initialState: {
    value: 'record',
  },
  reducers: {
    changeAppState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeAppState } = AppStateSlice.actions;

export default AppStateSlice.reducer;
