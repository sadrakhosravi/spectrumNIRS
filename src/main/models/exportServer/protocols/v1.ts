import { IProtocol } from '../ExportServer';

const V1: IProtocol = {
  name: 'v1',
  protocolVersion: 'v1',
  samplingRate: 100,
  parameters: [
    'timeStamp',
    'O2Hb',
    'HHb',
    'THb',
    'TOI',
    'Hbdiff',
    'PI',
    'SCORx',
    'SCPRx',
  ],
  batchSize: 25,
  payloadType: 'string',
};

export default V1;
