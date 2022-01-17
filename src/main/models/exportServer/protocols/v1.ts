import { IProtocol } from '../ExportServer';

const V1: IProtocol = {
  name: 'v1',
  outputDataSize: 'batch',
  samplingRate: 100,
  parameters: [
    'Time Stamp',
    'O2Hb',
    'HHb',
    'THb',
    'TOI',
    'Hbdiff',
    'PI',
    'SCORx',
    'SCPRx',
  ],
  protocolVersion: 'v1',
  payloadType: 'string',
};

export default V1;
