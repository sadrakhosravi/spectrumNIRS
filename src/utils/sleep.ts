/**
 * Super accurate sleep function that uses Atomics to stop the execution
 * @param ms
 */

const sleep = (ms: number) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

export default sleep;
