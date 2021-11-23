import { createSlice } from '@reduxjs/toolkit';

// Constants
import { ChartChannels, RecordChannels } from '@utils/channels';

type ExportStatus = 'idle' | 'loading' | 'done' | 'error' | 'canceled';

export type ChartSliceType = {
  rawdata: boolean;
  hypoxia: boolean;
  event2: boolean;
  exporttxt: boolean;
  exportStatus: ExportStatus;
  reviewXInterval: {
    start: number;
    end: number;
  };
};

const initialState: ChartSliceType = {
  rawdata: false,
  hypoxia: false,
  event2: false,
  exporttxt: false,
  exportStatus: 'idle',
  reviewXInterval: {
    start: 0,
    end: 30,
  },
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

      // Send the state to the controller
      window.api.sendIPC(ChartChannels.Event, { hypoxia: state.hypoxia });
    },
    toggleEvent2: (state) => {
      state.event2 = !state.event2;

      // Send the state to the controller
      window.api.sendIPC(ChartChannels.Event, { event2: state.event2 });
    },
    toggleExportTxt: (state) => {
      state.exporttxt = !state.exporttxt;
    },
    setExportStatus: (state, { payload }: { payload: ExportStatus }) => {
      state.exportStatus = payload;
    },
    setReviewXInterval: (
      state,
      { payload }: { payload: { start: number; end: number } }
    ) => {
      state.reviewXInterval = payload;
    },
  },
});

export const {
  setInitialState,
  toggleRawData,
  toggleHypoxia,
  toggleEvent2,
  toggleExportTxt,
  setExportStatus,
} = ChartSlice.actions;

export default ChartSlice.reducer;
