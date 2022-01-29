import { createStore } from 'vuex';
import user from './user';
import shared from './shared';

export default createStore({
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    shared,
  },
});
