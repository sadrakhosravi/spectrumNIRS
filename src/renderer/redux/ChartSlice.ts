import { createSlice } from '@reduxjs/toolkit';

// Constants
import { RecordChannels } from '@utils/channels';

type ChartSlice = {
  rawdata: boolean;
};

const initialState: ChartSlice = {
  rawdata: false,
};

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const ChartSlice = createSlice({
  name: 'chartSlice',
  initialState,
  reducers: {
    toggleRawData: (state) => {
      state.rawdata = !state.rawdata;
      window.api.sendIPC(RecordChannels.RawData);
    },
  },
});

export const { toggleRawData } = ChartSlice.actions;

export default ChartSlice.reducer;
