import { createSlice } from '@reduxjs/toolkit';

export type ChartPositions = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type InitialState = {
  chartPositions: ChartPositions[] | null;
  maximizedChannel: null | string;
};

const initialState: InitialState = {
  chartPositions: null,
  maximizedChannel: null,
};

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const RecordChartSlice = createSlice({
  name: 'recordChartSlice',
  initialState,
  reducers: {
    setRecordChartPositions: (
      state,
      { payload }: { payload: ChartPositions[] | null }
    ) => {
      state.chartPositions = payload;
    },
    setRecordChartMaximizedChannel: (
      state,
      { payload }: { payload: null | string }
    ) => {
      state.maximizedChannel = payload;
    },
    resetMaximizedChannel: (state) => {
      state.maximizedChannel = null;
    },
  },
});

export const {
  setRecordChartPositions,
  setRecordChartMaximizedChannel,
  resetMaximizedChannel,
} = RecordChartSlice.actions;

export default RecordChartSlice.reducer;
