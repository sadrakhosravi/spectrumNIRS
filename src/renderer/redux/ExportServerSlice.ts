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

const initialState: ExportServer = {
  serverInfo: {
    ip: null,
    port: null,
    version: '',
  },
  serverStatus: null,
  clientStatus: null,
  error: '',
};

export const ExportServerSlice = createSlice({
  name: 'exportServerSlice',
  initialState,
  reducers: {
    setExportServerInfo: (state, { payload }: { payload: IServerInfo }) => {
      state.serverInfo = payload;
    },
    setExportServerStatus: (state, { payload }: { payload: IServerStatus }) => {
      state.serverStatus = payload;
    },
    setClientStatus: (state, { payload }: { payload: IClientStatus[] }) => {
      state.clientStatus = payload;
    },
    setError: (state, { payload }: { payload: string }) => {
      state.error = payload;
    },
    resetExportServerInfo: () => initialState,
  },
});

export const {
  setExportServerInfo,
  setExportServerStatus,
  setClientStatus,
  setError,
  resetExportServerInfo,
} = ExportServerSlice.actions;

export default ExportServerSlice.reducer;
