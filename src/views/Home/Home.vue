<template>
  <div class="wrapper">
    <date-picker v-model="selectedDate"
                 :min-date='minDate'
                 :max-date='maxDate'
                 highlight-weekend
                 @dayclick="onDateClick($event)" />
  </div>
  <div v-if="!selectedDate"
       class="wrapper">
    <span class="datepick-message">Выберите дату</span>
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
      <va-inner-loading :loading="loading"
                        color="primary">
        <va-input v-model="name"
                  :rules="nameRules"
                  class="mt-4"
                  placeholder="Введите имя" />
        <va-input v-model="phone"
                  :rules="phoneRules"
                  class="mt-4"
                  placeholder="Введите номер телефона" />

      </va-inner-loading>
    </slot>
    <template #footer>
      <va-button v-if="enabledEnrolBtn"
                 :disabled="!isValidForm"
                 type="button"
                 @click="onEnrol()">
        Записаться
      </va-button>
    </template>
  </va-modal>
</template>

<script lang="ts">
import { DatePicker } from 'v-calendar';
import { defineComponent } from 'vue';
import { timesToPick } from '../../constants/';
import { DatePickerType } from '../../types';
import { ClientData } from '../../types/clients';
import { maxDate, minDate, getOccupiedTimes, enrolAClient } from './Home';
import { send } from '@emailjs/browser';
import { mapActions } from 'vuex';
import { monthsOfTheYear } from '../../constants';
import { formatDate } from '@/functions';

export default defineComponent({
  name: 'Home',
  components: {
    DatePicker,
  },
  data() {
    return {
      $vaToast: {} as any,
      selectedDate: null as null | Date,
      selectedTime: null as null | string,
      showModal: false as boolean,
      timeIsInUse: timesToPick as Array<string>,
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
      loading: false as boolean,
      enabledEnrolBtn: true as boolean,
      token: null as null | string,
    };
  },
  computed: {
    maxDate(): Date {
      return maxDate();
    },
    minDate(): Date {
      return minDate();
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
  // async created() {
  //   const messaging = getMessaging();

  //   await getToken(messaging, {
  //     vapidKey: 'BEzJ0Spne0WLLV-Wx5bMCr5F2-1Q2BRI2VbKep8Dmph84BQfQgr_kG_LSAnBqNc4_F4T2IUHoycS3hhFoeZtB8U',
  //   })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         this.token = currentToken;
  //         console.log(currentToken);
  //       } else {
  //         console.log('No registration token available. Request permission to generate one.');
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('An error occurred while retrieving token. ', err);
  //     });
  // },
  methods: {
    ...mapActions(['setError']),
    async onDateClick(e: DatePickerType) {
      this.selectedTime = null;
      const pickedDate = e.date;
      if (pickedDate >= this.minDate && pickedDate <= this.maxDate) {
        const year = pickedDate.getFullYear();
        const month = pickedDate.getMonth();
        const day = pickedDate.getDate();
        this.timeIsInUse = await getOccupiedTimes(year, month, day);
      }
    },

    onModalOpen(): void {
      this.showModal = true;
    },

    async onEnrol(): Promise<void> {
      this.loading = true;
      this.enabledEnrolBtn = false;
      const name = this.name;
      const phone = this.phone;
      if (this.selectedDate && this.selectedTime && name && phone) {
        const year = this.selectedDate.getFullYear();
        const month = this.selectedDate.getMonth();
        const day = this.selectedDate.getDate();
        const time = this.selectedTime;
        const enrolDate = new Date();

        const clientData = { name, phone, enrolDate } as ClientData;
        await enrolAClient(year, month, day, time, clientData);

        const monthName = monthsOfTheYear[month];
        const formattedStringDate = formatDate(enrolDate);
        const emailSendData = {
          clientName: name,
          time: time,
          day: day,
          month: monthName,
          enrolDate: formattedStringDate,
        };
        
        await send('default_service', 'template_gsi1g25', emailSendData).catch((e) => console.log(e));

        // const body = {
        //   to: this.token,
        //   notification: {
        //     title: 'У вас новая запись',
        //     body: `${name} записался на ${time}, ${day} числа на ${monthName}.`,
        //   },
        // };
        // const options = {
        //   method: 'POST',
        //   headers: new Headers({
        //     Authorization:
        //       'key=AAAAfDc01SU:APA91bGuunw-WX1QhLhsgU2wOOWFmW2UuBV4lOOz_t7XzPuphBS-VjdRb7a4JxiDcLtdJysJ4qyjTdb-n-_H1QOTvcuvITZbWD6X8mPG9CcsbT7Py9ZpP8t0WcUzpbUo3HrPWFHKbAeZ',
        //     'Content-Type': 'application/json',
        //   }),
        //   body: JSON.stringify(body),
        // };

        // await fetch('https://fcm.googleapis.com/fcm/send', options)
        //   .then((res) => console.log(res))
        //   .catch((e) => console.log(e));

        this.$vaToast.init({
          message: `Вы записались на ${this.selectedDate!.getDate()} число на ${this.selectedTime}`,
          position: 'bottom-right',
          color: 'success',
        });

        this.selectedDate = this.selectedTime = null;
        this.name = this.phone = '';
        this.showModal = false;
        this.loading = false;
        this.enabledEnrolBtn = true;
      } else {
        this.setError('Введите все данные для записи');
      }
    },
  },
});
</script>

<style scoped>
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

.datepick-message {
  font-family: 'Source Sans Pro', sans-serif;
  color: rgb(181, 0, 135);
}
</style>

<style>
.vc-highlight {
  background-color: #f464de !important;
}
</style>
