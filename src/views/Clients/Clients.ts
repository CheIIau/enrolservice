import { getDatabase, ref, child, onValue, set, update, get } from 'firebase/database';
import { daysInMonth } from '../../functions';
import { monthsOfTheYear } from '../../constants';
import { ClientsAtTimeType, ClientData, UpdateClientData } from '../../types/clients';
import store from '../../store';

export async function getYearsFromDB(): Promise<Array<string>> {
  try {
    const db = getDatabase();
    const clientsRef = ref(db);
    const years = [] as Array<string>;
    const clientsRefChildren = child(clientsRef, 'clients');
    await new Promise<void>((resolve) => {
      get(clientsRefChildren).then((snapshot) => {
        snapshot.forEach((child) => {
          const enrolYears = child.key as string;
          years.push(enrolYears);
        });
        resolve();
      });
    });
    return years;
  } catch (error: any) {
    store.dispatch('setError', error.message);
    return [];
  }
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

export async function getClientsDaysFromDB(year: string, month: number): Promise<Array<number>> {
  const availableDays = [] as Array<number>;
  try {
    const db = getDatabase();
    const clientsRef = ref(db, 'clients');
    const clientsRefChildren = child(clientsRef, `${year}/${month}`);
    await new Promise<void>((resolve) => {
      onValue(clientsRefChildren, (snapshot) => {
        snapshot.forEach((child) => {
          const day = Number(child.key);
          availableDays.push(day);
        });
        resolve();
      });
    });
    return availableDays;
  } catch (error: any) {
    store.dispatch('setError', error.message);
    return availableDays;
  }
}

export function getMonthNumber(month: string): number {
  return monthsOfTheYear.findIndex((el) => el === month);
}

export async function deleteClientFromDB(year: number, month: number, day: number, time: string): Promise<void> {
  const db = getDatabase();
  const clientsRef = ref(db, `clients/${year}/${month}/${day}/${time}`);
  await set(clientsRef, null);
}

export async function getClientsEnrolMonthsFromDB(year: string): Promise<Array<string>> {
  try {
    const db = getDatabase();
    const clientsRef = ref(db);
    const clientsRefChildren = child(clientsRef, `clients/${year}`);
    const months = [] as Array<string>;
    await new Promise<void>((resolve) => {
      onValue(clientsRefChildren, (snapshot) => {
        snapshot.forEach((child) => {
          const month = child.key as string;
          months.push(month);
        });
        resolve();
      });
    });
    return months;
  } catch (error: any) {
    store.dispatch('setError', error.message);
    return [];
  }
}

export async function getClientsOnDayFromDB(year: number, month: number, day: number): Promise<ClientsAtTimeType> {
  const resultTimes = {} as ClientsAtTimeType;
  try {
    const db = getDatabase();
    const clientsRef = ref(db, 'clients');
    const clientsRefChildren = child(clientsRef, `${year}/${month}/${day}`);
    await new Promise<void>((resolve) => {
      onValue(clientsRefChildren, (snapshot) => {
        snapshot.forEach((child) => {
          const time = child.key as string;
          const enrolCleintData = child.val() as ClientsAtTimeType;
          Object.assign(resultTimes, { [time]: enrolCleintData });
        });
        resolve();
      });
    });
    return resultTimes;
  } catch (error: any) {
    store.dispatch('setError', error.message);
    return resultTimes;
  }
}

export async function editClientDataInDB(
  year: number,
  month: number,
  day: number,
  time: string,
  newClientData: ClientData,
): Promise<void> {
  const updates = {} as UpdateClientData;
  try {
    const db = getDatabase();
    let clientsRef = ref(db, `clients/${year}/${month}/${day}/${time}`);
    await set(clientsRef, null);
    clientsRef = ref(db, 'clients/');
    const newTime = newClientData.time! as string;
    const updateKey = `${year}/${month}/${day}/${newTime}` as string;
    updates[updateKey] = newClientData;
    await update(clientsRef, updates);
  } catch (error: any) {
    store.dispatch('setError', error.message);
  }
}
