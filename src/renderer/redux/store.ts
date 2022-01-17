import { configureStore } from '@reduxjs/toolkit';

import { combineReducers } from 'redux';

// State slices
import AppStateReducer from '@redux/AppStateSlice';
import RecordStateReducer from '@redux/RecordStateSlice';
import SensorStateReducer from '@redux/SensorStateSlice';
import ModalStateReducer from '@redux/ModalStateSlice';
import IsLoadingReducer from '@redux/IsLoadingSlice';
import ExperimentDataReducer from '@redux/ExperimentDataSlice';
import ChartSliceReducer from './ChartSlice';
import ProbeStateReducer from './ProbeState';
import RecordChartReducer from './RecordChartSlice';
import ReviewChartReducer from './ReviewChartSlice';
import RecordingSettingsReducer from './RecordingSettings';
import GlobalStateReducer from './globalStateSlice';
import { experimentsApi } from './api/experimentsApi';

const reducers = combineReducers({
  appState: AppStateReducer,
  recordState: RecordStateReducer,
  sensorState: SensorStateReducer,
  modalState: ModalStateReducer,
  isLoadingState: IsLoadingReducer,
  experimentData: ExperimentDataReducer,
  chartState: ChartSliceReducer,
  probeState: ProbeStateReducer,
  recordChartState: RecordChartReducer,
  reviewChartState: ReviewChartReducer,
  recordingSettingsState: RecordingSettingsReducer,
  global: GlobalStateReducer,
  [experimentsApi.reducerPath]: experimentsApi.reducer,
});

// type AllReducers = typeof reducers;

// const reducersWithStateSync: AllReducers = withReduxStateSync(reducers) as any;

// const config: any = {
//   prepareState: (state: any) => state.toJS(),
//   blacklist: ['appState/setReviewTabInNewWindow'],
//   broadcastChannelOption: { type: 'localstorage' },
// };

const middlewares = [
  experimentsApi.middleware,
  // createStateSyncMiddleware(config),
];

const store = configureStore({
  reducer: reducers,
  middleware: (getGetDefaultMiddleware) =>
    getGetDefaultMiddleware().concat(...middlewares),
});

// // Redux sync state between tabs
// initStateWithPrevTab(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

const { dispatch, getState } = store;
export { dispatch, getState };
export default store;
