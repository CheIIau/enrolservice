<template>
  <div>
    <va-navbar color="#ff9eef"
               :shape="true">
      <template #left>
        <va-navbar-item>
          <va-avatar class="avatar"
                     src="android-chrome-192x192.png" />
          <router-link v-slot="{ navigate }"
                       to="/"
                       custom>
            <span role="link"
                  class="pointer navbar-title"
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
            <va-button role="link"
                       class="pointer nav-button"
                       color="#fcd4f6"
                       type="button"
                       @click="navigate">Авторизация</va-button>
          </router-link>
          <div v-else>
            <router-link v-slot="{ navigate }"
                         to="Clients"
                         custom>
              <va-button role="link"
                         color="#fcd4f6"
                         class='nav-button'
                         type="button"
                         @click="navigate">Клиенты</va-button>
            </router-link>
            <va-button type="button"
                       color="#fcd4f6"
                       class='nav-button'
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
  border: #fcd4f6 solid 2.5px;
  border-radius: 15px;
  padding: 7px;
}
@media (max-width: 767.98px) {
  .va-navbar {
    padding: 0;
    height: 3.5rem;
  }
}
.nav-button {
  color: #f464de !important;
}
.navbar-title {
  color: white;
  font-weight: 600;
  font-size: 18px;
}
.navbar-auth-btn {
  color: white;
}
</style>

<style>
@media (max-width: 767.98px) {
  .va-navbar__content {
    flex-direction: row !important;
  }
}
@media (max-width: 406px) {
  .va-button--normal .va-button__content {
    padding: 12px !important;
  }
}
.avatar {
  background-color: #fcd4f6 !important;
}
</style>