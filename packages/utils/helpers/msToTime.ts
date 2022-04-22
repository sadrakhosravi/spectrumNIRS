/**
 * A function that converts the given milliseconds to a time formatted as `hh:mm:ss`.
 * @param ms the total duration in milliseconds.
 */
export const msToTime = (duration: number) => {
  // Pad to 2 or 3 digits, default is 2
  function pad(n: number, z?: number) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  const ms = duration % 1000;
  duration = (duration - ms) / 1000;
  const secs = duration % 60;
  duration = (duration - secs) / 60;
  const mins = duration % 60;
  const hrs = (duration - mins) / 60;

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
};
