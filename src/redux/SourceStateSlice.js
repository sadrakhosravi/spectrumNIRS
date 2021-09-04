import { createSlice } from '@reduxjs/toolkit';

/**
 * State to manage the source of data to be recorded.
 */
export const SourceStateSlice = createSlice({
  name: 'sourceState',
  initialState: {
    value: 'NIRSReader', //can be 'NIRSReader', 'Reader1'...
  },
  reducers: {
    changeSourceState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeSourceState } = SourceStateSlice.actions;

export default SourceStateSlice.reducer;
