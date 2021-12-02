import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'utils/constants';

type AppStateSlice = {
  value: AppState;
  recordChartLoaded: boolean;
  reviewChartLoaded: boolean;
  recordSidebar: boolean;
  reviewSidebar: boolean;
  reviewTabInNewWindow: boolean;
  isLoadingData: boolean;
  isLoading: boolean;
};

const initialState: AppStateSlice = {
  value: AppState.HOME,
  recordChartLoaded: false,
  reviewChartLoaded: false,
  recordSidebar: true,
  reviewSidebar: true,
  reviewTabInNewWindow: false,
  isLoadingData: false,
  isLoading: false,
};

export const AppStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    changeAppState: (state, action) => {
      state.value = action.payload;
    },
    setRecordChartLoaded: (state, { payload }: { payload: boolean }) => {
      state.recordChartLoaded = payload;
    },
    setReviewChartLoaded: (state, { payload }: { payload: boolean }) => {
      state.reviewChartLoaded = payload;
    },
    setRecordSidebar: (state, { payload }: { payload: boolean }) => {
      state.recordSidebar = payload;
    },
    setReviewSidebar: (state, { payload }: { payload: boolean }) => {
      state.reviewSidebar = payload;
    },
    setReviewTabInNewWindow: (state, { payload }: { payload: boolean }) => {
      state.reviewTabInNewWindow = payload;
    },
    setIsAppLoading: (state, { payload }: { payload: boolean }) => {
      state.isLoading = payload;
    },
    setIsLoadingData: (state, { payload }: { payload: boolean }) => {
      state.isLoadingData = payload;
    },
  },
});

export const {
  changeAppState,
  setRecordChartLoaded,
  setReviewChartLoaded,
  setRecordSidebar,
  setReviewSidebar,
  setReviewTabInNewWindow,
  setIsAppLoading,
  setIsLoadingData,
} = AppStateSlice.actions;

export default AppStateSlice.reducer;
