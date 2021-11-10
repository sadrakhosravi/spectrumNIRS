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
  experimentId: number;
};

type CurrentRecording = {
  id: number;
  name: string;
  description: string;
  date: string;
  patientId: number;
};

export type ExperimentData = {
  currentExperiment: CurrentExperiment;
  currentPatient: CurrentPatient;
  currentRecording: CurrentRecording;
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
    experimentId: -1,
  },
  currentRecording: {
    id: -1,
    name: '',
    description: '',
    date: '',
    patientId: -1,
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
    },
    setPatientData: (state, { payload }) => {
      state.currentPatient = payload;
    },
    setRecordingData: (state, { payload }) => {
      state.currentRecording = payload;
      if (
        state.currentExperiment.name &&
        state.currentPatient.name &&
        state.currentRecording.name
      ) {
        state.isDataReady = true;
      } else {
        state.isDataReady = false;
      }
    },
  },
});

export const { setExperimentData, setPatientData, setRecordingData } =
  ExperimentDataSlice.actions;

export default ExperimentDataSlice.reducer;
