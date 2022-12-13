import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';

import { inject } from '@vercel/analytics';

createApp(App).mount('#app')

inject();
