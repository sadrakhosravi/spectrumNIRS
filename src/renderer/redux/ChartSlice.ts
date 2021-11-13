import { createSlice } from '@reduxjs/toolkit';

// Constants
import { RecordChannels } from '@utils/channels';

export type ChartSliceType = {
  rawdata: boolean;
  hypoxia: boolean;
  event2: boolean;
};

const initialState: ChartSliceType = {
  rawdata: false,
  hypoxia: false,
  event2: false,
};

export type chartStateOptions = keyof typeof initialState;

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const ChartSlice = createSlice({
  name: 'chartState',
  initialState,
  reducers: {
    setInitialState: () => initialState,
    toggleRawData: (state) => {
      state.rawdata = !state.rawdata;
      window.api.sendIPC(RecordChannels.RawData);
    },
    toggleHypoxia: (state) => {
      state.hypoxia = !state.hypoxia;
    },
    toggleEvent2: (state) => {
      state.event2 = !state.event2;
    },
  },
});

export const { setInitialState, toggleRawData, toggleHypoxia, toggleEvent2 } =
  ChartSlice.actions;

export default ChartSlice.reducer;
