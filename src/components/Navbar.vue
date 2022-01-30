<template>
  <div>
    <va-navbar color="primary"
               :shape="true">
      <template #left>
        <va-navbar-item>
          <va-avatar src="android-chrome-192x192.png" />
          <router-link v-slot="{ navigate }"
                       to="/"
                       custom>
            <span role="link"
                  class="pointer"
                  @click="navigate">RonikManik</span>
          </router-link>
        </va-navbar-item>
      </template>
      <template #right>
        <va-navbar-item>
          <router-link v-if="!isUserLoggedIn"
                       v-slot="{ navigate }"
                       to="Login"
                       custom>
            <span role="link"
                  class="pointer"
                  @click="navigate">Авторизация</span>
          </router-link>
          <va-button v-else
                     type="button"
                     @click="onLogout"> Выйти </va-button>
        </va-navbar-item>
      </template>
    </va-navbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  computed: {
    ...mapGetters(['isUserLoggedIn']),
  },
  methods: {
    ...mapActions(['logoutUser']),
    onLogout() {
      this.logoutUser();
      this.$router.push('/');
    },
  },
});
</script>
