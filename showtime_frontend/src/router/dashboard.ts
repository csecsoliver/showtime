import { createRouter, createWebHistory } from 'vue-router'
import MainDashView from '@/views/MainDashView.vue'
import SessionsView from '@/views/SessionsView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
    {
      path: '/dashboard',
      component: MainDashView,

    },
    {
      path: '/dashboard/sessions',
      component: SessionsView,

    },
    {
      path: '/dashboard/settings',
      component: SettingsView,

    },
  ],
})

export default router
