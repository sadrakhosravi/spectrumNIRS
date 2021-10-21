import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// State slices
import AppStateReducer from '@redux/AppStateSlice';
import RecordStateReducer from '@redux/RecordStateSlice';
import SourceStateReducer from '@redux/SourceStateSlice';
import ModalStateReducer from '@redux/ModalStateSlice';
import IsLoadingReducer from '@redux/IsLoadingSlice';
import ExperimentDataReducer from '@redux/ExperimentDataSlice';
import { experimentsApi } from './api/experimentsApi';

const reducers = combineReducers({
  appState: AppStateReducer,
  recordState: RecordStateReducer,
  sourceState: SourceStateReducer,
  modalState: ModalStateReducer,
  isLoadingState: IsLoadingReducer,
  experimentData: ExperimentDataReducer,
  [experimentsApi.reducerPath]: experimentsApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getGetDefaultMiddleware) =>
    getGetDefaultMiddleware().concat(experimentsApi.middleware),
});

export default store;
