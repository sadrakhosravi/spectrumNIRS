import { createSlice } from '@reduxjs/toolkit';
import { RecordState } from 'utils/constants';

const initialState = { value: RecordState.IDLE };

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const RecordStateSlice = createSlice({
  name: 'recordState',
  initialState,
  reducers: {
    changeRecordState: (state, action) => {
      console.log(action.type);
      state.value = action.payload;
    },
  },
});

export const { changeRecordState } = RecordStateSlice.actions;

export default RecordStateSlice.reducer;
