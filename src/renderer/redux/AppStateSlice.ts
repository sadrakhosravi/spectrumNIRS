import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'utils/constants';

type AppStateSlice = {
  value: AppState;
  recordSidebar: boolean;
  reviewTabInNewWindow: boolean;
  isLoading: boolean;
};

const initialState: AppStateSlice = {
  value: AppState.HOME,
  recordSidebar: true,
  reviewTabInNewWindow: false,
  isLoading: false,
};

export const AppStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    changeAppState: (state, action) => {
      state.value = action.payload;
    },
    setRecordSidebar: (state, { payload }: { payload: boolean }) => {
      state.recordSidebar = payload;
    },
    setReviewTabInNewWindow: (state, { payload }: { payload: boolean }) => {
      state.reviewTabInNewWindow = payload;
    },
    setIsAppLoading: (state, { payload }: { payload: boolean }) => {
      state.isLoading = payload;
    },
  },
});

export const {
  changeAppState,
  setRecordSidebar,

  setReviewTabInNewWindow,
  setIsAppLoading,
} = AppStateSlice.actions;

export default AppStateSlice.reducer;
