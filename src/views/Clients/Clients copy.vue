<template>
  <div class="wrapper wrapper__column">
    <va-button-dropdown class="mr-2 mb-2"
                        outline
                        label="Выберите год">
      <div v-for="year in years"
           :key="year">
        <va-button type="button"
                   class="mt-2"
                   @click="getClentsEnrolMonths(year)"> {{ year }} </va-button>
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
                     @click="getClentsData(month)"> {{ month }} </va-button>
        </div>
      </va-button-dropdown>
    </div>

  </div>
  <div class="wrapper">
    <date-picker v-if="showCalendar"
                 ref="calendar"
                 v-model="selectedDay"
                 :min-date='minDate'
                 :max-date='maxDate'
                 :disabled-dates="{weekdays: [1,2,3,4,5,6,7]}"
                 :available-dates="{days: availableDays}"
                 @dayclick="getClientsOnDay($event)" />
  </div>

  <va-data-table v-if="showDataTable"
                 :items="items"
                 :columns="columns"
                 striped>
    <template #headerAppend>
      <tr class="table-example--slot">
        <th v-for="key in Object.keys(createdItem)"
            :key="key"
            colspan="1">
          <va-input v-model="createdItem[key]"
                    :placeholder="key" />
        </th>
        <th colspan="1">
          <va-button :disabled="!isNewData"
                     @click="addNewItem()">
            Add
          </va-button>
        </th>
      </tr>
    </template>

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
import { daysInMonth } from '../../functions';

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
      years: [] as Array<string>,
      months: [] as Array<string>,
      clentsEnrolData: {} as ClientsAtDayType,
      selectedDay: null as null | Date,
      availableDays: [] as Array<number>,
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
      for (const key in this.clentsEnrolData) {
        const oneClientEnrolData = this.clentsEnrolData[key] as any;
        oneClientEnrolData.time = key;
        result.push(oneClientEnrolData);
      }
      return result;
    },
    minDate(): Date { //separate js
      const year = this.selectedYear;
      const month = this.selectedMonth;
      const minDate = new Date();
      if (year && month !== null) {
        minDate.setFullYear(year, month);
        minDate.setHours(0, 0, 0, 0);
      }
      return minDate;
    },
    maxDate(): Date { //separate js
      const year = this.selectedYear;
      const month = this.selectedMonth;
      const maxDate = new Date();
      maxDate.setHours(0, 0, 0, 0);
      if (year && month !== null) {
        const days = daysInMonth(year, month);
        maxDate.setFullYear(year, month, days);
      }
      return maxDate;
    },
  },
  async created() { 
    try {//separate js
      const db = getDatabase();
      const clientsRef = ref(db);
      const clientsRefChildren = child(clientsRef, 'clients');
      await new Promise<void>((resolve) => {
        onValue(clientsRefChildren, (snapshot) => {
          snapshot.forEach((child) => {
            const enrolYears = child.key as string;
            this.years.push(enrolYears);
          });
          resolve();
        });
      });
    } catch (error: any) {
      this.setError(error.message);
    }
  },

  methods: {
    ...mapActions(['setError']),
    async getClentsData(month: string) {
      const monthNumber = monthsOfTheYear.findIndex((el) => el === month);
      this.selectedMonth = Number(monthNumber);
      const year = this.selectedYear;
      this.availableDays = [];
      try {
        const db = getDatabase();
        const clientsRef = ref(db, 'clients');
        const resultTimes = {} as ClientsAtDayType;
        const clientsRefChildren = child(clientsRef, `${year}/${monthNumber}`);
        await new Promise<void>((resolve) => {
          onValue(clientsRefChildren, (snapshot) => {
            snapshot.forEach((child) => {
              const day = child.key as string;
              this.availableDays.push(Number(day));
              const enrolTime = child.val() as ClientsAtTimeType;
              Object.assign(resultTimes, { [day]: enrolTime });
            });
            console.log(resultTimes);
            resolve();
          });
        });
        this.showCalendar = true;
        this.$nextTick(async () => {
          const calendar = this.$refs.calendar as any;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await calendar.move(`${year}-0${this.selectedMonth! + 1}-01`, { force: true });
        });
      } catch (error: any) {
        this.setError(error.message);
      }
    },
    async getClentsEnrolMonths(year: string) {
      this.selectedYear = Number(year);
      this.showCalendar = false;
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
      const year = this.selectedYear;
      const month = this.selectedMonth;
      const day = e.day;
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
            this.clentsEnrolData = resultTimes;
            resolve();
          });
        });
      } catch (error: any) {
        this.setError(error.message);
      }
    },
  },
});
</script>

<style scoped>
.wrapper__column {
  align-content: space-around;
}
</style>