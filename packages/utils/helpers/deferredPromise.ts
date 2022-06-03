export type DeferredPromise<T> = Promise<T> & {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};

/**
 * @returns a deferred promise with `resolve` and `reject` methods.
 */
export const deferredPromise = <T>(): DeferredPromise<T> => {
  let res, rej;

  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  }) as any;

  promise.resolve = res;
  promise.reject = rej;

  return promise;
};
