<template>
  <div class="wrapper wrapper__column">
    <va-button-dropdown class="mr-2 mb-2"
                        outline
                        label="Выберите год">
      <div v-for="year in years"
           :key="year">
        <va-button type="button"
                   class="mt-2"
                   @click="getClientsEnrolMonths(year)"> {{ year }} </va-button>
      </div>
    </va-button-dropdown>
    <div>
      <va-button-dropdown v-if="months.length !==0"
                          class="mr-2 mb-2"
                          outline
                          label="Выберите месяц">
        <div v-for="month in nameOfMonths"
             :key="month">
          <va-button type="button"
                     class="mt-2"
                     @click="getClientsDays(month)"> {{ month }} </va-button>
        </div>
      </va-button-dropdown>
    </div>

  </div>
  <div class="wrapper">
    <date-picker v-if="showCalendar"
                 ref="calendar"
                 v-model="datePickerDate"
                 :min-date='minDate'
                 :max-date='maxDate'
                 :disabled-dates="{weekdays: [1,2,3,4,5,6,7]}"
                 :available-dates="{days: availableDays}"
                 @dayclick="getClientsOnDay($event)" />
  </div>

  <va-data-table v-if="showDataTable"
                 :items="arrayOfClients"
                 :columns="columnNames"
                 striped>
    <template #cell(actions)="{ rowIndex }">
      <va-button flat
                 icon="edit"
                 @click="openModalToEditItemById(rowIndex)" />
      <va-button flat
                 icon="delete"
                 @click="deleteItemById(rowIndex)" />
    </template>
  </va-data-table>
</template>

<script lang="ts">
import { DatePicker } from 'v-calendar';
import { mapActions } from 'vuex';
import { defineComponent } from 'vue';
import { getDatabase, ref, child, onValue } from 'firebase/database';
import { ClientsAtTimeType, ClientsAtDayType } from '../../types/clients';
import { monthsOfTheYear } from '../../constants';
import { getYearsFromDB, maxDate, minDate, getMonthNumber, getClientsDaysFromDB, deleteClientFromDB } from './Clients';

export default defineComponent({
  components: {
    DatePicker,
  },
  data() {
    return {
      showCalendar: false as boolean,
      showDataTable: false as boolean,
      selectedYear: null as number | null,
      selectedMonth: null as number | null,
      selectedDay: null as number | null,
      years: [] as Array<string>,
      months: [] as Array<string>,
      clientsEnrolData: {} as ClientsAtDayType,
      datePickerDate: null as null | Date,
      availableDays: [] as Array<number>,
      columnNames: [
        { key: 'name', label: 'Имя', sortable: true },
        { key: 'time', label: 'Время записи', sortable: true },
        { key: 'phone', label: 'Телефон', sortable: true },
        { key: 'actions', width: '80px', label: 'Действия' },
      ],
    };
  },
  computed: {
    nameOfMonths(): Array<string> {
      const months = this.months;
      return months.map((el: string, i: number): string => {
        return monthsOfTheYear[Number(months[i])];
      });
    },
    arrayOfClients() {
      const result = [];
      for (const key in this.clientsEnrolData) {
        const oneClientEnrolData = this.clientsEnrolData[key] as any; //gotta be fixed
        oneClientEnrolData.time = key;
        result.push(oneClientEnrolData);
      }
      return result;
    },
    minDate(): Date {
      const year = this.selectedYear!;
      const month = this.selectedMonth!;
      return minDate(year, month);
    },
    maxDate(): Date {
      const year = this.selectedYear!;
      const month = this.selectedMonth!;
      return maxDate(year, month);
    },
  },
  async created() {
    try {
      this.years = await getYearsFromDB();
    } catch (error: any) {
      this.setError(error.message);
    }
  },

  methods: {
    ...mapActions(['setError']),
    async getClientsDays(month: string) {
      const year = String(this.selectedYear);
      this.availableDays = [];
      this.showDataTable = false;
      const monthNumber = getMonthNumber(month);
      this.selectedMonth = monthNumber;
      try {
        const { availableDays, clientsAtDay } = await getClientsDaysFromDB(year, monthNumber);
        this.availableDays = availableDays;
        console.log(clientsAtDay);
        this.showCalendar = true;
        this.$nextTick(async () => {
          const calendar = this.$refs.calendar as any;
          await calendar.move(`${year}-0${this.selectedMonth! + 1}-01`, { force: true });
        });
      } catch (error: any) {
        this.setError(error.message);
      }
    },
    async getClientsEnrolMonths(year: string) {
      this.selectedYear = Number(year);
      this.showCalendar = false;
      this.showDataTable = false;
      this.months = [];
      try {
        const db = getDatabase();
        const clientsRef = ref(db);
        const clientsRefChildren = child(clientsRef, `clients/${year}`);
        await new Promise<void>((resolve) => {
          onValue(clientsRefChildren, (snapshot) => {
            snapshot.forEach((child) => {
              const month = child.key as string;
              this.months.push(month);
            });
            resolve();
          });
        });
      } catch (error: any) {
        this.setError(error.message);
      }
    },
    async getClientsOnDay(e: any): Promise<void> {
      this.showDataTable = false;
      const day = (this.selectedDay = e.day);
      const year = this.selectedYear;
      const month = this.selectedMonth;
      const resultTimes = {} as ClientsAtDayType;
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
            console.log(resultTimes);
            this.clientsEnrolData = resultTimes;
            this.showDataTable = true;
            resolve();
          });
        });
      } catch (error: any) {
        this.setError(error.message);
      }
    },
    openModalToEditItemById(e: any) {
      console.log(e);
    },
    async deleteItemById(rowIndex: any) {
      const year = this.selectedYear!;
      const month = this.selectedMonth!;
      const day = this.selectedDay!;
      const time = this.arrayOfClients[rowIndex].time;
      await deleteClientFromDB(year, month, day, time);
      delete this.clientsEnrolData[time];
    },
  },
});
</script>

<style scoped>
.wrapper__column {
  align-content: space-around;
}
</style>