import { Recording } from '@db/models/';

// Insert recording data
export const insertRecordingData = async (
  recordingData: Object,
  patientId: number
): Promise<void> => {
  await Recording.create({
    value: recordingData,
    patientId,
  });
};

// Stream recoding data from the database
export const getBatchRecordingData = async (
  batchSize: number,
  offset: number
) => {
  return await Recording.findAll({
    raw: true,
    offset: offset,
    limit: batchSize,
  });
};
