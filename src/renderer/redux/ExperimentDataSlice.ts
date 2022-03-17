import { createSlice } from '@reduxjs/toolkit';

type CurrentExperiment = {
  id: number;
  name: string;
  description: string;
  date: string;
  settings: JSON | null;
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

type PreviousData = {
  timeStamp: number;
  hasPreviousData: boolean;
};

export type ExperimentData = {
  currentExperiment: CurrentExperiment;
  currentPatient: CurrentPatient;
  currentRecording: CurrentRecording;
  previousRecording: PreviousData;
  isDataReady: boolean;
};

const initialState: ExperimentData = {
  currentExperiment: {
    id: -1,
    name: '',
    description: '',
    date: '',
    settings: null,
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
  previousRecording: {
    timeStamp: 0,
    hasPreviousData: false,
  },
  isDataReady: false,
};

export const ExperimentDataSlice = createSlice({
  name: 'experimentData',
  initialState,
  reducers: {
    setCurrentExperiment: (state, { payload }) => {
      state.currentExperiment = payload;
    },
    setExperimentData: (state, { payload }) => {
      state.currentExperiment = payload.currentExperiment;
      state.currentPatient = payload.currentPatient;
    },
    setPatientData: (state, { payload }) => {
      (state.currentRecording = initialState.currentRecording),
        (state.previousRecording = initialState.previousRecording),
        (state.currentPatient = payload);
    },
    setRecordingData: (state, { payload }) => {
      state.previousRecording = initialState.previousRecording;
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
    setPreviousData: (state, { payload }: { payload: PreviousData }) => {
      state.previousRecording = payload;
    },
    resetPatientData: (state) => {
      state.currentPatient = initialState.currentPatient;
    },
    resetRecordingData: (state) => {
      state.currentRecording = initialState.currentRecording;
      state.previousRecording = initialState.previousRecording;
    },
    resetExperimentData: () => initialState,
  },
});

export const {
  setCurrentExperiment,
  setExperimentData,
  setPatientData,
  setRecordingData,
  setPreviousData,
  resetPatientData,
  resetRecordingData,
  resetExperimentData,
} = ExperimentDataSlice.actions;

export default ExperimentDataSlice.reducer;
