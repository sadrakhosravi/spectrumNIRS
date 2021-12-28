class DatabaseError extends Error {
  constructor(error: any) {
    super();
    throw new Error(error.message);
  }
}

export default DatabaseError;
