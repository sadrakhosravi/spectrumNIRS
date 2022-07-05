/**
 * Wraps a promise so it can be used with React Suspense
 * @param {Promise} promise The promise to process
 * @returns {Object} A response object compatible with Suspense
 */
function wrapPromise<T>(promise: Promise<T>) {
  let status = 'pending';
  let response: any;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    },
  );

  const handler: any = {
    pending: () => {
      throw suspender;
    },
    error: () => {
      throw response;
    },
    default: () => response,
  };

  const read = (): T => {
    const result = handler[status] ? handler[status]() : handler.default();
    return result;
  };

  return { read };
}

export default wrapPromise;
