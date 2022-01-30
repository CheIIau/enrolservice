<template>
  <div>
    <va-button-dropdown class="mr-2 mb-2"
                        outline
                        label="Выберите год">
      <div v-for="year in years"
           :key="year">
        <va-button type="button"
                   class="mt-2"
                   @click="getClentsData(year)"> {{ year }} </va-button>
      </div>
    </va-button-dropdown>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import { defineComponent } from 'vue';
import { getDatabase, ref, child, onValue } from 'firebase/database';
import { ClientsAtYearsType, ClientsAtMonthType } from '../../types/clients';

export default defineComponent({
  data() {
    return {
      years: [] as Array<string>,
    };
  },
  async created() {
    try {
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
    async getClentsData(year: string) {
      try {
        const db = getDatabase();
        const clientsRef = ref(db);
        const resultTimes = {} as ClientsAtYearsType;
        const clientsRefChildren = child(clientsRef, `clients/${year}`);
        await new Promise<void>((resolve) => {
          onValue(clientsRefChildren, (snapshot) => {
            snapshot.forEach((child) => {
              const years = child.key as string;
              const enrolTime = child.val() as Array<ClientsAtMonthType>;
              Object.assign(resultTimes, { [years]: enrolTime });
            });
            console.log(resultTimes);
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