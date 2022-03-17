class DataError extends Error {
  constructor(message: string) {
    super(message);

    throw new DataError(message);
  }
}
export default DataError;
