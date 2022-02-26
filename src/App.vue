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
import { mapActions, mapGetters } from 'vuex';
import { init } from '@emailjs/browser';
import { initializeFirebase } from './App';

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
    initializeFirebase();
    init('user_HsEzFyOL27ObVuaNpwDbA'); //init emailJS
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

function initializeFirebase() {
  throw new Error('Function not implemented.');
}

function initializeFirebase() {
  throw new Error('Function not implemented.');
}
