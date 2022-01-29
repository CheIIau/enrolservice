import store from '../store/index';
import { NavigationGuard } from 'vue-router';

export const AuthGuard: NavigationGuard = (to, from, next) => {
  if (store.getters.user || store.getters.localUser) {
    next();
  } else {
    next('/login?loginError=true');
  }
};
