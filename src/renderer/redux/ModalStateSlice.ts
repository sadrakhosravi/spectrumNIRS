import { createSlice } from '@reduxjs/toolkit';

/**
 * State to determine whether the app is recording data, paused, continued recording, or idle(not recording)
 */
export const ModalStateSlice = createSlice({
  name: 'modalState',
  initialState: {
    value: 0, // Which modal to open
  },
  reducers: {
    openModal: (state, action) => {
      state.value = action.payload;
    },
    closeModal: (state) => {
      state.value = 0;
    },
  },
});

export const { openModal, closeModal } = ModalStateSlice.actions;

export default ModalStateSlice.reducer;
