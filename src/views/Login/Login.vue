<template>
  <div class="login">
    <va-form ref="form"
             class="formLogin"
             tag="form"
             @submit="login">
      <va-input v-model="email"
                autosize
                class="mt-3 mb-4"
                label="Email"
                :rules="emailRules"> </va-input>
      <va-input v-model="password"
                autosize
                class="mb-4"
                type="password"
                label="Пароль"
                :rules="passwordRules">
      </va-input>
      <va-button type="submit"
                 class="mt-2"
                 :disabled="!isValid"
                 @click="login"> Авторизация </va-button>
    </va-form>
  </div>
</template>

<script lang="ts">
import { AuthParamsType } from '@/types/user';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      email: '' as string,
      password: '' as string,
      emailPattern: /.+@.+\..+/ as RegExp,
      passwordPattern: /^.{8,20}$/ as RegExp,
      emailRules: [
        (v: string) => !!v || 'Нужно ввести Email',
        (v: string) => /.+@.+\..+/.test(v) || 'Email должен быть валидным',
      ],
      passwordRules: [
        (v: string) => !!v || 'Нужно ввести пароль',
        (v: string) => (v && /^.{8,20}$/.test(v)) || 'Пароль должен быть длиннее 8 и короче 20 символов',
      ],
    };
  },
  computed: {
    isValid() {
      if (this.emailPattern.test(this.email) && this.passwordPattern.test(this.password)) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions(['setError', 'loginUser']),
    async login() {
      if (this.isValid) {
        try {
          await this.loginUser({ email: this.email, password: this.password } as AuthParamsType);
          this.$router.push('/');
        } catch (error: any) {
          this.setError(error.message);
        }
      }
    },
  },
});
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
}
.formLogin {
  width: 400px;
}
</style>
