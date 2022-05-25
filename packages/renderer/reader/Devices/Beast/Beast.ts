/**
 * Beast Device Plugin
 * @version 0.0.5
 * @author Sadra Khosravi
 */

// Import components
import { BeastPhysicalDevice } from './BeastPhysicalDevice';
import { BeastInput } from './BeastInput';
import { BeastParser } from './BeastParser';

// Interfaces
import { IDevice } from 'reader/api/device-api';

const Beast: IDevice = {
  Device: BeastPhysicalDevice,
  //@ts-ignore
  Input: BeastInput,
  Parser: BeastParser,
};

export default Beast;
