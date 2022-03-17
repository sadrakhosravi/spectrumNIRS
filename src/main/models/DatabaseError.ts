class DatabaseError extends Error {
  constructor(error: any) {
    super();
    console.log('DATABASE ERROR: ' + error.message);
  }
}

export default DatabaseError;
