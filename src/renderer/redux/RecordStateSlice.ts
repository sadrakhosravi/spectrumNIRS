import { createSlice } from '@reduxjs/toolkit';
import { RecordState } from 'utils/constants';

interface IRecordState {
  value: RecordState;
}

const initialState: IRecordState = { value: RecordState.IDLE };

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const RecordStateSlice = createSlice({
  name: 'recordState',
  initialState,
  reducers: {
    changeRecordState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeRecordState } = RecordStateSlice.actions;

export default RecordStateSlice.reducer;
