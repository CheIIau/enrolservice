import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './configs/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import store from './store';

export function initializeFirebase(): void {
  initializeApp(firebaseConfig);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      store.dispatch('autoLoginUser', user);
    }
  });
}
