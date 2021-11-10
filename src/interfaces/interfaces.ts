export interface INewPatientData {
  name: string;
  dob: string;
  description: string;
  experimentId?: number;
}

export interface INewRecordingData {
  name: string;
  date: string;
  description: string;
  patientId?: number;
}
