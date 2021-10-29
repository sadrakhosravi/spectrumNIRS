import { configureStore } from '@reduxjs/toolkit';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// State slices
import AppStateReducer from '@redux/AppStateSlice';
import RecordStateReducer from '@redux/RecordStateSlice';
import SensorStateReducer from '@redux/SensorStateSlice';
import ModalStateReducer from '@redux/ModalStateSlice';
import IsLoadingReducer from '@redux/IsLoadingSlice';
import ExperimentDataReducer from '@redux/ExperimentDataSlice';
import ReviewTabReducer from '@redux/ReviewTabStateSlice';
import { experimentsApi } from './api/experimentsApi';

const reducers = combineReducers({
  appState: AppStateReducer,
  recordState: RecordStateReducer,
  sensorState: SensorStateReducer,
  modalState: ModalStateReducer,
  isLoadingState: IsLoadingReducer,
  experimentData: ExperimentDataReducer,
  reviewTabState: ReviewTabReducer,
  [experimentsApi.reducerPath]: experimentsApi.reducer,
});

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: reducers,
  middleware: (getGetDefaultMiddleware) =>
    getGetDefaultMiddleware().concat(experimentsApi.middleware),
});

const { dispatch, getState } = store;
export { dispatch, getState };
export default store;
