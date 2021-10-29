import { createSlice } from '@reduxjs/toolkit';

type CurrentExperiment = {
  id: number;
  name: string;
  description: string;
  date: string;
};

type CurrentPatient = {
  id: number;
  name: string;
  description: string;
  dob: string;
};

export type ExperimentData = {
  currentExperiment: CurrentExperiment;
  currentPatient: CurrentPatient;
  isDataReady: boolean;
};

const initialState: ExperimentData = {
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

  isDataReady: false,
};

export const ExperimentDataSlice = createSlice({
  name: 'experimentData',
  initialState,
  reducers: {
    setExperimentData: (state, { payload }) => {
      state.currentExperiment = payload.currentExperiment;
      state.currentPatient = payload.currentPatient;
      if (state.currentExperiment.name && state.currentPatient.name)
        state.isDataReady = true;
    },
    setPatientData: (state, { payload }) => {
      state.currentPatient = payload;
      if (state.currentExperiment.name && state.currentPatient.name)
        state.isDataReady = true;
    },
  },
});

export const { setExperimentData, setPatientData } =
  ExperimentDataSlice.actions;

export default ExperimentDataSlice.reducer;
