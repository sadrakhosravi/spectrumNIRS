import { IDeviceInput } from '../../Interfaces';
import { BeastCmd } from '../Beast/BeastCommandsEnum,';
import { MessageType } from '../Beast/BeastInput';

export class SyncPulseInput implements IDeviceInput {
  getIsConnected(): boolean {
    throw new Error('Method not implemented.');
  }
  setIO(_io: any): void {
    throw new Error('Method not implemented.');
  }
  sendCommand(_command: BeastCmd, _message: MessageType): boolean | undefined {
    throw new Error('Method not implemented.');
  }
  updateSettings(_settings: any): boolean {
    throw new Error('Method not implemented.');
  }
}
