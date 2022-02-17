import { createSlice } from '@reduxjs/toolkit';
import { IGlobalStore } from '@lib/globalStore/GlobalStore';

interface IGlobalStateSlice {
  exportServer: IGlobalStore['exportServer'] | null;
  experiment: IGlobalStore['experiment'] | null;
  patient: IGlobalStore['patient'] | null;
  recording: IGlobalStore['recording'] | null;
  recordState: IGlobalStore['recordState'] | null;
}

const initialState: IGlobalStateSlice = {
  exportServer: null,
  experiment: null,
  patient: null,
  recording: null,
  recordState: null,
};

export const GlobalStateSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    setGlobalState: (_, { payload }: { payload: any }) => payload,
  },
});

export const { setGlobalState } = GlobalStateSlice.actions;

export default GlobalStateSlice.reducer;
