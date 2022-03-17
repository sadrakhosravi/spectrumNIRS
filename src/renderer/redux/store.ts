import { configureStore } from '@reduxjs/toolkit';

import { combineReducers } from 'redux';

// State slices
import AppStateReducer from '@redux/AppStateSlice';
import SensorStateReducer from '@redux/SensorStateSlice';
import ModalStateReducer from '@redux/ModalStateSlice';
import ExperimentDataReducer from '@redux/ExperimentDataSlice';
import ChartSliceReducer from './ChartSlice';
import ProbeStateReducer from './ProbeState';
import RecordChartReducer from './RecordChartSlice';
import ReviewChartReducer from './ReviewChartSlice';
import GlobalStateReducer from './globalStateSlice';
import { experimentsApi } from './api/experimentsApi';

const reducers = combineReducers({
  appState: AppStateReducer,
  sensorState: SensorStateReducer,
  modalState: ModalStateReducer,
  experimentData: ExperimentDataReducer,
  chartState: ChartSliceReducer,
  probeState: ProbeStateReducer,
  recordChartState: RecordChartReducer,
  reviewChartState: ReviewChartReducer,
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

const { dispatch, getState, subscribe, replaceReducer } = store;
export { dispatch, getState, subscribe, replaceReducer };
export default store;
