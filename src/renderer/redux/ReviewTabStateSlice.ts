import { createSlice } from '@reduxjs/toolkit';

export const ReviewTabStateSlice = createSlice({
  name: 'reviewTabState',
  initialState: {
    value: false,
  },
  reducers: {
    setIsNewWindow: (state, { payload }: { payload: boolean }) => {
      state.value = payload;
    },
  },
});

export const { setIsNewWindow } = ReviewTabStateSlice.actions;

export default ReviewTabStateSlice.reducer;
