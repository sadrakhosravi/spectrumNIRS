import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '@constants/Constants';

interface IAction {
  payload: AppState.HOME | AppState.RECORD | AppState.REVIEW;
}

/**
 * Determine the state of the app. Used to navigate to home, record, or review sections.
 */
export const AppStateSlice = createSlice({
  name: 'appState',
  initialState: {
    value: 'home', // Can be 'home', 'record', 'review' - Check app state enum
  },
  reducers: {
    changeAppState: (state, action: IAction) => {
      state.value = action.payload;
    },
  },
});

export const { changeAppState } = AppStateSlice.actions;

export default AppStateSlice.reducer;
