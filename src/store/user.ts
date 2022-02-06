import { Module } from 'vuex';
import { UserState, UserClass } from '../types/user';
import { AuthParamsType } from '../types/user';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return JSON.parse(localStorage.getItem('user')!);
    },
    isUserLoggedIn(state): boolean {
      return state.user !== null;
    },
  },
  actions: {
    autoLoginUser({ commit }, payload: User): void {
      const user = { uid: payload.uid };
      commit('setUser', user);
      commit('setLocalUser', user);
    },
    async loginUser({ commit }, { email, password }: AuthParamsType): Promise<void> {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          commit('setUser', { user: user.uid });
        })
        .catch((error: any) => {
          commit('setError', error.message);
          throw error;
        });
    },
    async logoutUser({ commit }) {
      const auth = getAuth();
      await signOut(auth).catch((error) => {
        commit('setError', error.message);
        throw error;
      });
      localStorage.removeItem('user');
      commit('setUser', null);
    },
  },
};

export default user;
