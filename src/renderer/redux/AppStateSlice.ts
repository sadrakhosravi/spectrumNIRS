import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'utils/constants';

type AppStateSlice = {
  value: AppState;
  windowResized: number;
  windowMaximized: boolean;
  recordChartLoaded: boolean;
  reviewChartLoaded: boolean;
  recordSidebar: boolean;
  reviewSidebar: boolean;
  probeCalibrationSidebar: boolean;
  reviewTabInNewWindow: boolean;
  isLoadingData: boolean;
  isLoading: boolean;
};

const initialState: AppStateSlice = {
  value: AppState.HOME,
  windowResized: 0,
  windowMaximized: true,
  recordChartLoaded: false,
  reviewChartLoaded: false,
  recordSidebar: true,
  reviewSidebar: true,
  probeCalibrationSidebar: true,
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
    setWindowResized: (state, { payload }: { payload: number }) => {
      state.windowResized = payload;
      console.log(payload);
    },
    setWindowMaximized: (state, { payload }: { payload: boolean }) => {
      state.windowMaximized = payload;
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
    setProbeCalibrationSidebar: (state, { payload }: { payload: boolean }) => {
      state.probeCalibrationSidebar = payload;
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
  setWindowResized,
  setWindowMaximized,
  setRecordChartLoaded,
  setReviewChartLoaded,
  setRecordSidebar,
  setReviewSidebar,
  setProbeCalibrationSidebar,
  setReviewTabInNewWindow,
  setIsAppLoading,
  setIsLoadingData,
} = AppStateSlice.actions;

export default AppStateSlice.reducer;
