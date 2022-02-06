export function daysInMonth(year: number, month: number): number {
  return 32 - new Date(year, month, 32).getDate();
}
