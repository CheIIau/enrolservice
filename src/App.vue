<template>
  <navbar></navbar>
  <div class="layout">
    <router-view />
  </div>
  <template v-if="error">
    <va-alert dense
              center
              color="danger">
      {{ error }}
    </va-alert>
  </template>
</template>

<script lang="ts">

import { getMessaging, getToken } from 'firebase/messaging';
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './configs/firebaseConfig';
import { mapActions, mapGetters } from 'vuex';
import { getAuth, onAuthStateChanged} from 'firebase/auth';

export default defineComponent({
  components: {
    Navbar,
  },
  computed: {
    ...mapGetters(['error']),
  },
  watch: {
    error() {
      if (this.error !== false)
        setTimeout(() => {
          this.setError(null);
        }, 5000);
    },
  },
  created() {
    initializeApp(firebaseConfig);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.autoLoginUser(user);
      }
    });
    const messaging = getMessaging();

    getToken(messaging, {
      vapidKey: 'BEzJ0Spne0WLLV-Wx5bMCr5F2-1Q2BRI2VbKep8Dmph84BQfQgr_kG_LSAnBqNc4_F4T2IUHoycS3hhFoeZtB8U',
    })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          console.log(currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  },
  methods: {
    ...mapActions(['setError', 'autoLoginUser']),
  },
});
</script>

<style>
.pointer {
  cursor: pointer;
}
.wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
