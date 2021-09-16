import { configureStore } from '@reduxjs/toolkit';

// State slices
import AppStateReducer from '@redux/AppStateSlice';
import RecordStateReducer from '@redux/RecordStateSlice';
import SourceStateReducer from '@redux/SourceStateSlice';
import NewExperimentReducer from '@redux/NewExperimentSlice';
import ExperimentInfoReducer from '@redux/ExperimentInfoSlice';

const store = configureStore({
  reducer: {
    appState: AppStateReducer,
    recordState: RecordStateReducer,
    sourceState: SourceStateReducer,
    newExperimentState: NewExperimentReducer,
    experimentInfo: ExperimentInfoReducer,
  },
});

export default store;
