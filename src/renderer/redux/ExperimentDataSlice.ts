import { createSlice } from '@reduxjs/toolkit';
import { IExperimentData } from '@interfaces/interfaces';
/**
 * Determine the state of the app. Used to navigate to home, record, or review sections.
 */

const initialState: IExperimentData = {
  value: {
    currentExperiment: {
      id: -1,
      name: '',
      description: '',
      date: '',
    },
    currentPatient: {
      id: -1,
      name: '',
      description: '',
      dob: '',
    },
    currentSensor: {
      id: -1,
      name: '',
    },
  },
};

export const ExperimentDataSlice = createSlice({
  name: 'experimentData',
  initialState,
  reducers: {
    setExperimentData: (state, action) => {
      state.value.currentExperiment = action.payload.currentExperiment;
      state.value.currentPatient = action.payload.currentPatient;
    },
    setPatientData: (state, action) => {
      state.value.currentPatient = action.payload;
    },
    setCurrentSensor: (state, action) => {
      state.value.currentSensor = action.payload;
    },
  },
});

export const { setExperimentData, setPatientData, setCurrentSensor } =
  ExperimentDataSlice.actions;

export default ExperimentDataSlice.reducer;
