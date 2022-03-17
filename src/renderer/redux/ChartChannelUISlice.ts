import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  test: 1,
};

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const ChartChannelUISlice = createSlice({
  name: 'chartChannelUI',
  initialState,
  reducers: {
    setChannelUIResize: (state, { payload }: { payload: number }) => {
      state.test = payload;
    },
  },
});

export const { setChannelUIResize } = ChartChannelUISlice.actions;

export default ChartChannelUISlice.reducer;
