import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index"
import naive from 'naive-ui'
import axios from 'axios'


axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/1374485-0-default/';

createApp(App).use(router).use(naive).mount('#app')
