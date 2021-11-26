export interface INewPatientData {
  name: string;
  dob: string;
  description: string;
  experiment?: number;
}

export interface INewRecordingData {
  name: string;
  date: string;
  description: string;
  patient?: number;
}
