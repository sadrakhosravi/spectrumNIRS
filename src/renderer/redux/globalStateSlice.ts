import { createSlice } from '@reduxjs/toolkit';
import { IGlobalStore } from '@lib/globalStore/GlobalStore';

interface IGlobalStateSlice {
  experiment: IGlobalStore['experiment'] | null;
  patient: IGlobalStore['patient'] | null;
  recording: IGlobalStore['recording'] | null;
  recordState: IGlobalStore['recordState'] | null;
  probe: IGlobalStore['probe'] | null;
  exportServer: IGlobalStore['exportServer'] | null;
}

const initialState: IGlobalStateSlice = {
  experiment: null,
  patient: null,
  recording: null,
  probe: null,
  recordState: null,
  exportServer: null,
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
