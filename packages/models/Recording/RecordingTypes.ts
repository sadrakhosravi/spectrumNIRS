/**
 * The recording record type from the database
 */
export type RecordingType = {
  created_timestamp: Date;
  description: string;
  id: string;
  last_update_timestamp: number;
  name: string;
  settings: RecordingSettings;
};

export type RecordingSettings = any;
