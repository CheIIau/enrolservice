import store from '../../store';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { ClientData, UpdateClientData } from '@/types/clients';

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

export async function getOccupiedTimes(year: number, month: number, day: number): Promise<Array<string>> {
  const resultTimes = [] as Array<string>;
  try {
    const db = getDatabase();
    const clientsRef = ref(db, `clients/${year}/${month}/${day}`);
    await new Promise<void>((resolve) => {
      onValue(clientsRef, (snapshot) => {
        snapshot.forEach((child) => {
          const enrolTime = child.key as string;
          resultTimes.push(enrolTime);
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

export async function enrolAClient(
  year: number,
  month: number,
  day: number,
  time: string,
  clientData: ClientData,
): Promise<void> {
  const updates = {} as UpdateClientData;
  try {
    const db = getDatabase();
    const clientsRef = ref(db, 'clients/');
    const updateKey = `${year}/${month}/${day}/${time}` as string;
    updates[updateKey] = clientData;
    await update(clientsRef, updates);
  } catch (error: any) {
    store.dispatch('setError', error.message);
  }
}
