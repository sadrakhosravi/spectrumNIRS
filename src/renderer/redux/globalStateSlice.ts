import { createSlice } from '@reduxjs/toolkit';
import {
  IServerStatus,
  IClientStatus,
  IServerInfo,
} from '@electron/models/ExportServer';

export type ExportServer = {
  serverInfo: IServerInfo;
  serverStatus: IServerStatus | null;
  clientStatus: IClientStatus[] | null;
  error: string;
};

type GlobalStore = {
  exportServer: ExportServer | null;
};

const initialState: GlobalStore = {
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
