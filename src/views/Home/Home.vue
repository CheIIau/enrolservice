<template>
  <div class="wrapper">
    <date-picker v-model="selectedDate"
                 :min-date='minDate'
                 :max-date='maxDate'
                 @dayclick="onDateClick($event)" />
  </div>
  <div v-if="!selectedDate"
       class="wrapper">
    <span color="success">Выберите дату</span>
  </div>
  <div v-if="selectedDate"
       class="wrapper">
    <div class="radioButtonWrapper mb-4">
      <va-radio v-for="(option, index) in timesToPick"
                :key="index"
                v-model="selectedTime"
                :disabled="timeIsInUse.includes(option)"
                :class="{isUnactive : timeIsInUse.includes(option)}"
                :option="option"
                class="radioButtonTimePicker" />
    </div>
  </div>
  <div v-if="selectedTime"
       class="wrapper">
    <va-button color="success"
               @click="onModalOpen">Записаться</va-button>
  </div>

  <va-modal v-model="showModal"
            hide-default-actions
            overlay-opacity="0.2">
    <template #header>
      <h2>Введите контактные данные</h2>
    </template>
    <slot>
      <va-input v-model="name"
                :rules="nameRules"
                class="mt-4"
                placeholder="Введите имя" />
      <va-input v-model="phone"
                :rules="phoneRules"
                class="mt-4"
                placeholder="Введите номер телефона" />
    </slot>
    <template #footer>
      <va-button :disabled="!isValidForm"
                 type="button"
                 @click="onEnrol(), $vaToast.init({
          message: `Вы записались на ${selectedDate.getDate()} число на ${selectedTime}`,
          position: 'bottom-right',
          color: 'success',
        });">
        <!-- defect in the ui, components, only solution is above -->
        Записаться
      </va-button>
    </template>
  </va-modal>
</template>

<script lang="ts">
import { DatePicker } from 'v-calendar';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import { timesToPick } from '../../constants/';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { DatePickerType } from '../../types';
import { ClientData, UpdateClientData } from '../../types/clients';

export default defineComponent({
  name: 'Home',
  components: {
    DatePicker,
  },
  data() {
    return {
      selectedDate: null as null | Date,
      selectedTime: null as null | string,
      showModal: false as boolean,
      timeIsInUse: [] as Array<string>,
      name: '' as string,
      phone: '' as string,
      nameRules: [
        (v: string) => !!v || 'Нужно ввести имя',
        (v: string) => (v && /^.{3,20}$/.test(v)) || 'Имя должно быть длиннее 3 и короче 20 символов',
      ],
      namePattern: /^.{3,20}$/ as RegExp,
      phonePattern: /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/ as RegExp,
      phoneRules: [
        (v: string) => !!v || 'Нужно ввести телефон',
        (v: string) => /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/.test(v) || 'Телефон должен быть валидным',
      ],
    };
  },
  computed: {
    maxDate(): Date {
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 1);
      maxDate.setHours(0, 0, 0, 0);
      return maxDate;
    },
    minDate(): Date {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 1);
      minDate.setHours(0, 0, 0, 0);
      return minDate;
    },
    timesToPick(): Array<string> {
      return timesToPick;
    },
    isValidForm(): boolean {
      if (this.namePattern.test(this.name) && this.phonePattern.test(this.phone)) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    timeIsInUse() {
      if (this.timeIsInUse.length !== 0) {
        this.timeIsInUse.forEach((el: string): void => {
          const index = this.timesToPick.findIndex((elem) => elem === el);
          if (index !== -1) {
            const minIndex = index - 7 < 0 ? 0 : index - 7;
            const maxIndex = index + 7 > this.timesToPick.length - 1 ? this.timesToPick.length - 1 : index + 7;
            for (let i = minIndex; i <= maxIndex; i++) {
              this.timeIsInUse.push(this.timesToPick[i]);
            }
          }
        });
      }
    },
  },
  methods: {
    ...mapActions(['setError']),
    async onDateClick(e: DatePickerType): Promise<void> {
      const pickedDate = e.date;
      if (pickedDate >= this.minDate && pickedDate <= this.maxDate) {
        const year = pickedDate.getFullYear();
        const month = pickedDate.getMonth();
        const day = pickedDate.getDate();
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
          this.selectedTime = null;
          this.timeIsInUse = resultTimes;
        } catch (error: any) {
          this.setError(error.message);
        }
      }
    },
    onModalOpen(): void {
      this.showModal = true;
    },
    async onEnrol(): Promise<void> {
      if (this.selectedDate && this.selectedTime) {
        const year = this.selectedDate.getFullYear();
        const month = this.selectedDate.getMonth();
        const day = this.selectedDate.getDate();
        const time = this.selectedTime;
        const name = this.name;
        const phone = this.phone;

        const enrolDate = new Date();
        const clientData = { name, phone, enrolDate } as ClientData;
        const updates = {} as UpdateClientData;
        try {
          const db = getDatabase();
          const clientsRef = ref(db, 'clients/');
          const updateKey = `${year}/${month}/${day}/${time}` as string;
          updates[updateKey] = clientData;
          await update(clientsRef, updates);
        } catch (error: any) {
          this.setError(error.message);
        }
        this.selectedDate = this.selectedTime = null;
        this.name = this.phone = '';
        this.showModal = false;
      }
    },
  },
});
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.radioButtonWrapper {
  max-width: 300px;
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-wrap: wrap;
}
.radioButtonTimePicker {
  padding: 4px;
  border-radius: 14px;
  border: solid 2px #4ae387;
}
.isUnactive {
  border-color: rgb(255, 65, 110, 0.5);
}
</style>