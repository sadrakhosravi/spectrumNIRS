import { createSlice } from '@reduxjs/toolkit';
import { IExperimentData } from '@interfaces/interfaces';

type SensorInitData = {
  patientId: number;
  sensorId: number;
};

const sendRecordingInit = (sensorInitData: SensorInitData) => {
  window.api.sendIPC('record:init', sensorInitData);
};

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
      // Send the selected sensor to the controller
      const patientId = state.value.currentPatient.id;
      const sensorId = state.value.currentSensor.id;
      sendRecordingInit({ patientId, sensorId });
    },
  },
});

export const { setExperimentData, setPatientData, setCurrentSensor } =
  ExperimentDataSlice.actions;

export default ExperimentDataSlice.reducer;
