import { createSlice } from '@reduxjs/toolkit';

export const AppStateSlice = createSlice({
  name: 'appState',
  initialState: {
    value: 'home', //Can be 'home', 'record', 'review'
  },
  reducers: {
    changeAppState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeAppState } = AppStateSlice.actions;

export default AppStateSlice.reducer;
