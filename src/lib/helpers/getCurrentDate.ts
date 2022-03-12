/**
 * @returns - Todays date in YYYY-MM-DD
 */
const getCurrentDate = (): string => {
  // Get today's Date
  const date = new Date();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  return `${date.getFullYear()}-${month}-${day}`;
};

export default getCurrentDate;
