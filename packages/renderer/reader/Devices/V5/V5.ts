/**
 * V5 Device Plugin
 * @version 0.5.0
 * @author Sadra Khosravi
 */

// Import components
import { V5PhysicalDevice } from './V5PhysicalDevice';
import { V5Input } from './V5Input';
import { V5Parser } from './V5Parser';

// Interfaces
import { IDevice } from 'reader/api/device-api';

const V5: IDevice = {
  Device: V5PhysicalDevice,
  Input: V5Input,
  Parser: V5Parser,
};

export default V5;
