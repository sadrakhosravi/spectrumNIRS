export interface IExperimentData {
  value: {
    currentExperiment: {
      id: number;
      name: string;
      description: string;
      date: string;
    };
    currentPatient: {
      id: number;
      name: string;
      description: string;
      dob: string;
    };
  };
}
