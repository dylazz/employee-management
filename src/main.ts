import {createApp} from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from "./router";

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
