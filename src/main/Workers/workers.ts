// load modules
import { Worker, isMainThread, MessageChannel } from 'worker_threads';
const { port1 } = new MessageChannel();

const dbWorker = () => {
  if (isMainThread) {
    // create worker threads.

    //db worker thread.
    const worker1 = new Worker(`${__dirname}/dbWorker.js`);
    port1.postMessage('Test');
    worker1.on('exit', (code) => console.log(code));
  }
};

export default dbWorker;
