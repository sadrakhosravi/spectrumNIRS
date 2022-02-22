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
  TOI: number | undefined;
};

const initialState: InitialState = {
  chartPositions: null,
  maximizedChannel: null,
  TOI: 0,
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
    setTOIValue: (state, { payload }: { payload: number | undefined }) => {
      state.TOI = payload;
    },
  },
});

export const {
  setRecordChartPositions,
  setRecordChartMaximizedChannel,
  resetMaximizedChannel,
  setTOIValue,
} = RecordChartSlice.actions;

export default RecordChartSlice.reducer;
