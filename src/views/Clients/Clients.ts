import { getDatabase, ref, child, onValue } from 'firebase/database';
import { daysInMonth } from '../../functions';
import { monthsOfTheYear } from '../../constants';
import { ClientsAtTimeType, ClientsAtDayType, TypeClientsDaysFromDB } from '../../types/clients';

export async function getYearsFromDB(): Promise<Array<string>> {
  const db = getDatabase();
  const clientsRef = ref(db);
  const years = [] as Array<string>;
  const clientsRefChildren = child(clientsRef, 'clients');
  await new Promise<void>((resolve) => {
    onValue(clientsRefChildren, (snapshot) => {
      snapshot.forEach((child) => {
        const enrolYears = child.key as string;
        years.push(enrolYears);
      });
      resolve();
    });
  });
  return years;
}

export function maxDate(year: number, month: number): Date {
  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);
  if (year && month !== null) {
    const days = daysInMonth(year, month);
    maxDate.setFullYear(year, month, days);
  }
  return maxDate;
}

export function minDate(year: number, month: number): Date {
  const minDate = new Date();
  if (year && month !== null) {
    minDate.setFullYear(year, month);
    minDate.setHours(0, 0, 0, 0);
  }
  return minDate;
}

export async function getClientsDaysFromDB(year: string, month: number): Promise<TypeClientsDaysFromDB> {
  const availableDays = [] as Array<number>;
  const db = getDatabase();
  const clientsRef = ref(db, 'clients');
  const clientsAtDay = {} as ClientsAtDayType;
  const clientsRefChildren = child(clientsRef, `${year}/${month}`);
  await new Promise<void>((resolve) => {
    onValue(clientsRefChildren, (snapshot) => {
      snapshot.forEach((child) => {
        const day = Number(child.key);
        availableDays.push(day);
        const enrolTime = child.val() as ClientsAtTimeType;
        Object.assign(clientsAtDay, { [day]: enrolTime });
      });
      resolve();
    });
  });
  return { availableDays, clientsAtDay };
}

export function getMonthNumber(month: string): number {
  return monthsOfTheYear.findIndex((el) => el === month);
}
