/**
 * Async Handler function that wraps the function in a try catch block.
 * @param fn The function to be executed
 * @returns The function wrapped in an async try catch block
 */
export const asyncHandler = (fn: any) => {
  return async (args: any) => {
    try {
      await fn(...args);
    } catch (error) {
      // Forward error to the global error handler
      console.log(error);
    }
  };
};
