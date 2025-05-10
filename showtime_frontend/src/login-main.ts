import './assets/main.css'

import { createApp } from 'vue'
import { createPinia, getActivePinia } from 'pinia'

import LoginPage from './LoginPage.vue'
import router from './router'

const app = createApp(LoginPage)

app.use(createPinia())
app.use(router)

app.mount('#login-app')
