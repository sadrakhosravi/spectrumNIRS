import { configureStore } from '@reduxjs/toolkit';
import AppStateReducer from './AppStateSlice';

export const store = configureStore({
  reducer: {
    appState: AppStateReducer,
  },
});
