import './assets/main.css'

import { createApp } from 'vue'
import { createPinia, getActivePinia } from 'pinia'

import DashPage from './DashPage.vue'
import router from './router/dashboard.ts'

const app = createApp(DashPage)

app.use(createPinia())
app.use(router)
app.mount('#dash-app')






