import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index"
import naive from 'naive-ui'
import axios from 'axios'


axios.defaults.baseURL = 'http://82.156.125.202/soft2/';

createApp(App).use(router).use(naive).mount('#app')
