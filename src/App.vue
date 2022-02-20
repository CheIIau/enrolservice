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
import { defineComponent } from 'vue';
import Navbar from './components/TheNavbar.vue';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './configs/firebaseConfig';
import { mapActions, mapGetters } from 'vuex';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { init } from '@emailjs/browser';

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
    init('user_HsEzFyOL27ObVuaNpwDbA');
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
