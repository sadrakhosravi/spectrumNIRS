import { createSlice } from '@reduxjs/toolkit';

interface IActions {
  payload: true | false;
}

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const IsLoadingState = createSlice({
  name: 'isLoadingState',
  initialState: {
    value: false, // Which modal to open
  },
  reducers: {
    isLoading: (state, action: IActions) => {
      state.value = action.payload;
    },
  },
});

export const { isLoading } = IsLoadingState.actions;

export default IsLoadingState.reducer;
