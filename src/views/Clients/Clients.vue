<template>
  <div>
    <va-button type="button"
               class="mt-2"
               @click="getClentsData"> Дата </va-button>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import { defineComponent } from 'vue';
import { getDatabase, ref, child, onValue } from 'firebase/database';
import { ClientsType } from '../../types/clients';

export default defineComponent({
  methods: {
    ...mapActions(['setError']),
    async getClentsData() {
      try {
        const resultTimes = [] as Array<ClientsType>;
        const db = getDatabase();
        const clientsRef = ref(db);
        const timesObject = {};
        const clientsRefChildren = child(clientsRef, 'clients');
        await new Promise<void>((resolve) => {
          onValue(clientsRefChildren, (snapshot) => {
            snapshot.forEach((child) => {
              const years = child.key as string;
              const enrolTime = child.val() as ClientsType;
              resultTimes.push(enrolTime);
              Object.assign(timesObject, { [years]: resultTimes });
            });
            console.log(timesObject);
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