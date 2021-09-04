import { createSlice } from '@reduxjs/toolkit';

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const RecordStateSlice = createSlice({
  name: 'recordState',
  initialState: {
    value: 'idle', //can be 'idle', 'recording', 'pause','continue', 'stop'
  },
  reducers: {
    changeRecordState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeRecordState } = RecordStateSlice.actions;

export default RecordStateSlice.reducer;
