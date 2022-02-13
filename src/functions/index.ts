export function daysInMonth(year: number, month: number): number {
  return 32 - new Date(year, month, 32).getDate();
}

export function formatDate(enrolDate: Date): string {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const year = enrolDate.getFullYear();
  const month = months[enrolDate.getMonth()];
  const date = enrolDate.getDate();
  const hour = enrolDate.getHours();
  const min = enrolDate.getMinutes() < 10 ? '0' + enrolDate.getMinutes() : enrolDate.getMinutes();
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
  return time;
}
