import { createSlice } from '@reduxjs/toolkit';

export const RecordStateSlice = createSlice({
  name: 'recordState',
  initialState: {
    value: 'idle', //can be 'idle', 'recording', or 'pause'
  },
  reducers: {
    changeRecordState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeRecordState } = RecordStateSlice.actions;

export default RecordStateSlice.reducer;
