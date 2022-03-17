import { getState } from '@redux/store';

import { IExperimentData } from '@electron/models/ExperimentModel';
import { IPatientData } from '@electron/models/PatientModel';

class ExperimentUI {
  experiment: IExperimentData | null | undefined;
  patient: IPatientData | null | undefined;

  constructor() {
    this.experiment = getState().global.experiment?.currentExp;
    this.patient = getState().global.patient?.currentPatient;
  }
}

export default ExperimentUI;
