import { Module, StoreOptions } from 'vuex';
import { RootState } from '../types';

const user: StoreOptions<RootState> = {
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setLocalUser(state, payload) {
      const jsonUser = JSON.stringify(payload);
      localStorage.setItem('user', jsonUser);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    localUser() {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      } else return null;
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    },
  },
  actions: {},
  modules: {},
};

export default user;
