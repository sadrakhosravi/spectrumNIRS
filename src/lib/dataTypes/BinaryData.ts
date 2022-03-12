import Avro from 'avsc';

// Database data type to be converted to binary format
export const DBDataModel = Avro.Type.forValue(
  [{ ADC1: [4000, 3000, 5000, 1000, 2100, 500] }],
  {
    omitRecordMethods: true,
  }
);
