import './assets/css/style.css';
import "./assets/css/tailwind.css";

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';


import App from './App.vue';
import router from './router';
import hljsVuePlugin from "@/utils/Blog/MarkdownHighlight";

library.add(fab);
library.add(fas);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
app.use(router);
app.use(hljsVuePlugin);

app.mount('#app')
