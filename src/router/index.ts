import { createRouter, createWebHistory } from 'vue-router'
import routes from './route'

const base = import.meta.env.BASE_URL

const router = createRouter({
  history: createWebHistory(base),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

export default router
