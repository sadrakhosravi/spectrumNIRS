import { configureStore } from '@reduxjs/toolkit';

// State slices
import AppStateReducer from '@redux/AppStateSlice';
import RecordStateReducer from '@redux/RecordStateSlice';
import SourceStateReducer from '@redux/SourceStateSlice';
import ModalStateReducer from '@redux/ModalStateSlice';
import IsLoadingReducer from '@redux/IsLoadingSlice';
import ExperimentDataReducer from '@redux/ExperimentDataSlice';
import { experimentsApi } from './api/experimentsApi';

const store = configureStore({
  reducer: {
    appState: AppStateReducer,
    recordState: RecordStateReducer,
    sourceState: SourceStateReducer,
    modalState: ModalStateReducer,
    isLoadingState: IsLoadingReducer,
    experimentData: ExperimentDataReducer,
    [experimentsApi.reducerPath]: experimentsApi.reducer,
  },
  middleware: (getGetDefaultMiddleware) =>
    getGetDefaultMiddleware().concat(experimentsApi.middleware),
});

export default store;
