import './assets/main.css'

import { createApp } from 'vue'
import { createPinia, getActivePinia } from 'pinia'

import LoginPage from './LoginPage.vue'

const app = createApp(LoginPage)

app.use(createPinia())

app.mount('#login-app')






