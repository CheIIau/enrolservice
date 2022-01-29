import { Module } from 'vuex';
import { SharedState } from '../types';

const shared: Module<SharedState, unknown> = {
  state: { error: null },
  getters: {
    error(state) {
      return state.error;
    },
  },
  mutations: {
    setError(state, payload: string) {
      state.error = payload;
    },
  },
  actions: {
    setError({ commit }, payload: string) {
      commit('setError', payload);
    },
  },
};

export default shared;
