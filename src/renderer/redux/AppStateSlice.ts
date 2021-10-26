import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'utils/constants';

const sendAppStateToController = (_appState: AppState) => {};

interface IAction {
  payload: AppState;
}

/**
 * Determine the state of the app. Used to navigate to home, record, or review sections.
 */
export const AppStateSlice = createSlice({
  name: 'appState',
  initialState: {
    value: AppState.HOME, // Can be 'home', 'record', 'review' - Check app state enum
  },
  reducers: {
    changeAppState: (state, action: IAction) => {
      state.value = action.payload;
      sendAppStateToController(state.value);
    },
  },
});

export const { changeAppState } = AppStateSlice.actions;

export default AppStateSlice.reducer;
