import { createApp } from 'vue';
import type { App as VueApp } from 'vue';
import App from './App.vue';
import router from './routes';
import type { Router } from 'vue-router';

const app: VueApp = createApp(App);
app.use(router as Router );
app.mount('#app');
