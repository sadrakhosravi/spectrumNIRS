/**
 * Get local IP address, while ignoring vEthernet IP addresses (like from Docker, etc.)
 */
import { networkInterfaces } from 'os';

export interface INetwork {
  address: string;
  netmask: string;
  family: string;
  mac: string;
  internal: boolean;
  cidr: string;
  interface: string;
}

const getLocalIP = (): INetwork[] => {
  const nets = networkInterfaces();
  const results: any[] = []; // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    //@ts-ignore
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        const ipv4: any = net;
        ipv4.interface = name;
        results.push(net);
      }
    }
  }

  return results;
};

export default getLocalIP;
