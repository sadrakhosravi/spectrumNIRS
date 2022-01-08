import { createSlice } from '@reduxjs/toolkit';

export type RecordingSettings = {
  channels: string[];
};

const initialState: RecordingSettings = {
  channels: [],
};

export const recordingSettings = createSlice({
  name: 'recordingSettings',
  initialState,
  reducers: {
    setChannels: (state, { payload }: { payload: string[] }) => {
      state.channels = payload;
    },
  },
});

export const { setChannels } = recordingSettings.actions;

export default recordingSettings.reducer;
