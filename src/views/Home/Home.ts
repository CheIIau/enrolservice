export function minDate(): Date {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);
  return minDate;
}
export function maxDate(): Date {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  maxDate.setHours(0, 0, 0, 0);
  return maxDate;
}
