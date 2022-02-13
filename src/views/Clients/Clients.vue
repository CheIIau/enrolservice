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

  <va-modal :model-value="!!editedItem"
            message="Изменить запись"
            @ok="editItem"
            @cancel="resetEditedItem">
    <slot>
      <va-input v-for="key in Object.keys(editedItem)"
                :key="key"
                v-model="editedItem[key]"
                class="my-3"
                :label="key" />
    </slot>
  </va-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DatePicker } from 'v-calendar';
import { ClientsAtTimeType, ClientData } from '../../types/clients';
import { DatePickerType } from '../../types/';
import { monthsOfTheYear } from '../../constants';
import {
  getYearsFromDB,
  maxDate,
  minDate,
  getMonthNumber,
  getClientsDaysFromDB,
  deleteClientFromDB,
  getClientsEnrolMonthsFromDB,
  getClientsOnDayFromDB,
  editClientDataInDB,
} from './Clients';

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
      clientsEnrolData: {} as ClientsAtTimeType,
      datePickerDate: null as null | Date,
      availableDays: [] as Array<number>,
      columnNames: [
        { key: 'name', label: 'Имя', sortable: true },
        { key: 'time', label: 'Время записи', sortable: true },
        { key: 'phone', label: 'Телефон', sortable: true },
        { key: 'actions', width: '80px', label: 'Действия' },
      ],
      editedItemId: null as null | number,
      editedItem: null as ClientData | null,
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
        const oneClientEnrolData = this.clientsEnrolData[key] as unknown as ClientData;
        oneClientEnrolData.time = key;
        delete oneClientEnrolData.enrolDate;
        result.push(oneClientEnrolData);
      }
      result.sort((a: ClientData, b: ClientData): number => {
        return Number(a.time!.split(':')[0]) - Number(b.time!.split(':')[0]);
      });
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
    this.years = await getYearsFromDB();
  },

  methods: {
    async getClientsDays(month: string): Promise<void> {
      this.availableDays = [];
      this.showDataTable = false;
      const year = String(this.selectedYear);
      const monthNumber = getMonthNumber(month);
      this.selectedMonth = monthNumber;
      const availableDays = await getClientsDaysFromDB(year, monthNumber);
      this.availableDays = availableDays;
      this.showCalendar = true;
      this.$nextTick(async () => {
        const calendar = this.$refs.calendar as any;
        await calendar.move(`${year}-0${this.selectedMonth! + 1}-01`, { force: true });
      });
    },

    async getClientsEnrolMonths(year: string): Promise<void> {
      this.selectedYear = Number(year);
      this.showCalendar = false;
      this.showDataTable = false;
      this.months = await getClientsEnrolMonthsFromDB(year);
    },

    async getClientsOnDay(e: DatePickerType): Promise<void> {
      this.showDataTable = false;
      const day = (this.selectedDay = e.day);
      const year = this.selectedYear!;
      const month = this.selectedMonth!;
      this.clientsEnrolData = await getClientsOnDayFromDB(year, month, day);
      this.showDataTable = true;
    },

    openModalToEditItemById(id: number) {
      this.editedItemId = id;
      this.editedItem = { ...this.arrayOfClients[id] };
    },

    async deleteItemById(rowIndex: number) {
      const year = this.selectedYear!;
      const month = this.selectedMonth!;
      const day = this.selectedDay!;
      const time = this.arrayOfClients[rowIndex].time!;
      await deleteClientFromDB(year, month, day, time);
      delete this.clientsEnrolData[time];
    },

    resetEditedItem() {
      this.editedItem = null;
      this.editedItemId = null;
    },

    async editItem() {
      if (this.editedItemId !== null) {
        const year = this.selectedYear!;
        const month = this.selectedMonth!;
        const day = this.selectedDay!;
        const time = this.arrayOfClients[this.editedItemId].time!;
        const newClientData = this.editedItem as ClientData;
        if (newClientData) {
          await editClientDataInDB(year, month, day, time, newClientData);
          delete this.clientsEnrolData[time];
          this.clientsEnrolData[newClientData.time!] = newClientData;
        }
        this.editedItem = null;
        this.editedItemId = null;
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