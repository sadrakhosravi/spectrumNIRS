import { configureStore } from '@reduxjs/toolkit';

//State slices
import AppStateReducer from '@redux/AppStateSlice';
import RecordStateReducer from '@redux/RecordStateSlice';

export const store = configureStore({
  reducer: {
    appState: AppStateReducer,
    recordState: RecordStateReducer,
  },
});
