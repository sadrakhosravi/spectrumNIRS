import { createSlice } from '@reduxjs/toolkit';
import { IEvents } from '@electron/models/DeviceReader/EventManager';

export type ChartSliceType = {
  allEvents: IEvents[] | null;
};

const initialState: ChartSliceType = {
  allEvents: null,
};

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const ChartSlice = createSlice({
  name: 'chartState',
  initialState,
  reducers: {
    setInitialState: () => initialState,

    setAllEvents: (state, { payload }: { payload: any[] }) => {
      state.allEvents = payload;
    },
  },
});

export const { setInitialState, setAllEvents } = ChartSlice.actions;

export default ChartSlice.reducer;
