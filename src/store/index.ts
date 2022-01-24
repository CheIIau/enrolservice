import { createStore } from 'vuex';

export default createStore({
  state: { error: null },
  getters: {
    error(state) {
      return state.error;
    },
  },
  mutations: {
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    setError({ commit }, payload) {
      commit('setError', payload);
    },
  },
});
