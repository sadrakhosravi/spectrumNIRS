import { DeviceDataType } from '@electron/models/DeviceReader/DeviceDataTypes';

/**
 * Optimized function to copy device data objects
 * @param data the device data object
 * @param batchSize size of the data array
 * @returns an array of copied data objects
 */
const copyDeviceDataObject = (data: DeviceDataType[], batchSize: number) => {
  const copiedData = [];
  const dataObjKeys = Object.keys(data[0]);
  const dataObjKeysLength = dataObjKeys.length;

  for (let i = 0; i < batchSize; i += 1) {
    const obj: any = {};
    // For each keys of the object
    for (let j = 0; j < dataObjKeysLength; j += 1) {
      obj[dataObjKeys[j]] =
        data[i][dataObjKeys[j] as keyof DeviceDataType].slice();
    }
    copiedData.push(obj);
  }
  return copiedData;
};

export default copyDeviceDataObject;
