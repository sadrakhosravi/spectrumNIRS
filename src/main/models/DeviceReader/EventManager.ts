export interface IEvents {
  name: string;
  type: 'single' | 'start-stop';
  system: boolean;
  category?: string;
  color?: string;
  timeStamp?: number;
  timeSequence?: number;
  start?: boolean;
  stop?: boolean;
}

type EventsData = {
  events: any;
};

let Snappy: any;

// Loads the write module depending on the process type
if (process.type === 'browser') {
  Snappy = require('snappy');
} else {
  Snappy = require('snappy-electron');
}

class EventManager {
  public static parseEvents(events: EventsData[]) {
    let eventsArr: any[] = [];

    for (let i = 0; i < events.length; i += 1) {
      if (!events[i].events) {
        continue;
      }
      const data = Snappy.uncompressSync(events[i].events);
      const eventsData = JSON.parse(data);
      eventsArr.push(...eventsData);
    }
    return eventsArr;
  }
}

export default EventManager;
