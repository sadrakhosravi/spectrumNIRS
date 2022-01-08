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
export const ReviewChartSlice = createSlice({
  name: 'chartChannelUI',
  initialState,
  reducers: {
    setReviewChartPositions: (
      state,
      { payload }: { payload: ChartPositions[] | null }
    ) => {
      state.chartPositions = payload;
    },
    setReviewChartMaximizedChannel: (
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
  setReviewChartPositions,
  setReviewChartMaximizedChannel,
  resetMaximizedChannel,
} = ReviewChartSlice.actions;

export default ReviewChartSlice.reducer;
