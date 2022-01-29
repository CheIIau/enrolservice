import { UserClass } from '../types/user';

export interface UserState {
  user: UserClass | null;
}

// export interface RootState {

// }

export interface SharedState {
  error: string | null;
}

export interface DatePickerType {
  id: string;
  label: string;
  ariaLabel: string;
  day: number;
  dayFromEnd: number;
  weekday: number;
  weekdayPosition: number;
  weekdayPositionFromEnd: number;
  weekdayOrdinal: number;
  weekdayOrdinalFromEnd: number;
  week: number;
  weekFromEnd: number;
  weeknumber: number;
  isoWeeknumber: number;
  month: number;
  year: number;
  date: Date;
  range: Range;
  isToday: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
  inMonth: boolean;
  inPrevMonth: boolean;
  inNextMonth: boolean;
  onTop: boolean;
  onBottom: boolean;
  onLeft: boolean;
  onRight: boolean;
  classes: Array<{ [key: string]: boolean } | string>;
  isDisabled: boolean;
  isFocusable: boolean;
  attributesMap: any;
  shouldRefresh: boolean;
  attributes: any[];
  el: any;
  popovers: any[];
  event: Event;
}
