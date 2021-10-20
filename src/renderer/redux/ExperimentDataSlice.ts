import { createSlice } from '@reduxjs/toolkit';
import { IExperimentData } from '@interfaces/interfaces';

type SensorInitData = {
  patientId: number;
  sensorId: number;
};

/**
 * Send the initial data to the controller.
 * @param initData - Initial data `{patientId, sensorId}`
 */
const sendRecordingInit = (initData: SensorInitData) => {
  window.api.sendIPC('record:init', initData);
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

      const patientId = state.value.currentPatient.id;
      const sensorId = state.value.currentSensor.id;

      console.log(patientId, sensorId);

      // Check if the data is available and send it to the controller
      if (patientId !== -1 && sensorId !== -1) {
        sendRecordingInit({ patientId, sensorId });
      }
    },
  },
});

export const { setExperimentData, setPatientData, setCurrentSensor } =
  ExperimentDataSlice.actions;

export default ExperimentDataSlice.reducer;
