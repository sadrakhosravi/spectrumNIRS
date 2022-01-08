import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  defaultProbe: {
    id: 0,
  },
};

export const ProbeState = createSlice({
  name: 'probeState',
  initialState,
  reducers: {
    setDefaultProbe: (state, { payload }: { payload: { id: number } }) => {
      state.defaultProbe = payload;
      console.log(payload);
    },
  },
});

export const { setDefaultProbe } = ProbeState.actions;

export default ProbeState.reducer;
