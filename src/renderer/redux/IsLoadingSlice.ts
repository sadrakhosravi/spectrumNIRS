import { createSlice } from '@reduxjs/toolkit';

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const IsLoadingState = createSlice({
  name: 'isLoadingState',
  initialState: {
    value: false, // Which modal to open
  },
  reducers: {
    loading: (state) => {
      state.value = true;
    },
    notLoading: (state) => {
      state.value = false;
    },
  },
});

export const { loading, notLoading } = IsLoadingState.actions;

export default IsLoadingState.reducer;
