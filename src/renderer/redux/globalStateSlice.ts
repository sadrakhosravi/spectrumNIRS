import { createSlice } from '@reduxjs/toolkit';
import { IGlobalStore } from '@lib/globalStore/GlobalStore';

interface IGlobalStateSlice {
  exportServer: IGlobalStore['exportServer'] | null;
}

const initialState: IGlobalStateSlice = {
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
