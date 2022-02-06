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
          <div v-else>
            <router-link v-slot="{ navigate }"
                         to="Clients"
                         custom>
              <span role="link"
                    class="pointer  navbar-item"
                    @click="navigate">Клиенты</span>
            </router-link>
            <va-button type="button"
                       @click="onLogout"> Выйти </va-button>
          </div>

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

<style scoped>
.navbar-item {
  border: rgb(109, 190, 255) solid 2px;
  border-radius: 15px;
  padding: 5px;
}
@media (max-width: 767.98px) {
  .va-navbar {
    padding: 0;
    height: 3.5rem;
  }
}
</style>

<style>
@media (max-width: 767.98px) {
  .va-navbar__content {
    flex-direction: row !important;
  }
}
@media (max-width: 400px) {
  .va-navbar__left {
    justify-content: left !important;
  }
}
</style>