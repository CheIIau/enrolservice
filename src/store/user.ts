import { Module } from 'vuex';
import { UserState } from '../types';
import { UserClass } from '../types/user';
import { AuthParamsType } from '../types/user';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const user: Module<UserState, unknown> = {
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
    user(state): UserClass | null {
      return state.user;
    },
    localUser(): UserClass | null {
      return JSON.parse(localStorage.getItem('user') || '{}');
    },
    isUserLoggedIn(state): boolean {
      return state.user !== null;
    },
  },
  actions: {
    autoLoginUser({ commit }, payload): void {
      const user = { uid: payload.uid };
      commit('setUser', user);
      commit('setLocalUser', user);
    },
    async loginUser({ commit }, { email, password }: AuthParamsType): Promise<void> {
      const auth = getAuth();
      console.log(email, password);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          commit('setUser', { user: user.uid });
        })
        .catch((error: any) => {
          commit('setError', error.message);
          throw error;
        });
    },
  },
};

export default user;
