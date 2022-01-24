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
                  @click="navigate"
                  @keypress.enter="navigate">RonikManik</span>
          </router-link>
        </va-navbar-item>
      </template>
      <template #right>
        <va-navbar-item>Запись клиента</va-navbar-item>
      </template>
    </va-navbar>
  </div>
</template>