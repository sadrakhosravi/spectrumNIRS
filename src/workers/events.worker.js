'use strict';
/**
 * This worker takes an array of events passed on to it and return an array
 * containing the start and the end of each event
 */

/**
 * Converts milliseconds to time format
 * @param {number} duration - Duration in milliseconds
 * @returns Time in HH:mm:ss.ms format
 */
const msToTime = (duration) => {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds;
};

// Listen for messages from the main thread
self.onmessage = ({ data }) => {
  // if no events found return null
  data.length === 0 && self.postMessage(null);
  self.postMessage(sortEvents(data));
};

const sortEvents = (data) => {
  const allEvents = ['hypoxia', 'event2'];

  // Array used to send the final sorted events to be added to the graph
  const eventsArr = [];

  // Keeps track of the current on/off events
  const currentEvent = {};

  // Add all the existing events to the current event object
  allEvents.forEach((event) => {
    currentEvent[event] = false;
  });

  console.time('startEvent'); // TODO: ONLY FOR DEBUGGING

  const dataLength = data.length;
  // Using for loop for maximum performance
  for (let i = 0; i < dataLength; i++) {
    // Parse the JSON from string
    const events = JSON.parse(data[i].events);
    allEvents.forEach((event) => {
      // If the difference in time is more than 10 milliseconds,
      // the event was stopped, so reset the current events.
      if (data[i].timeStamp - data[i - 1]?.timeStamp > 10) {
        currentEvent[event] = false;
        eventsArr.push({
          ...data[i],
          name: event[0].toUpperCase() + event.substring(1) + ' Stop',
          end: true,
          time: msToTime(data[i].timeStamp),
        });
      }

      // If the event was turned off and the current event still has it on
      // turn the current event off.
      if (events[event] === false && currentEvent[event] === true) {
        currentEvent[event] = false;
        eventsArr.push({
          ...data[i],
          name: event[0].toUpperCase() + event.substring(1) + ' Stop',
          end: true,
          time: msToTime(data[i].timeStamp),
        });
      }

      // If the the current event is not on and the there is an active event,
      // turn event on and save the first point
      if (
        event in events &&
        events[event] === true &&
        currentEvent[event] === false
      ) {
        eventsArr.push({
          ...data[i],
          name: event[0].toUpperCase() + event.substring(1),
          time: msToTime(data[i].timeStamp),
        });
        currentEvent[event] = true;
      }
    });
  }

  console.timeEnd('startEvent'); // TODO: ONLY FOR DEBUGGING

  return eventsArr;
};
