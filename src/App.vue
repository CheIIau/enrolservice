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

<script>
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './configs/firebaseConfig';
import { mapActions, mapGetters } from 'vuex';

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
  },
  methods: {
    ...mapActions(['setError']),
  },
});
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
