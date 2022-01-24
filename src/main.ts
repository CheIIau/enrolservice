import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { VuesticPlugin } from 'vuestic-ui';

createApp(App).use(store).use(router).use(VuesticPlugin).mount('#app');
