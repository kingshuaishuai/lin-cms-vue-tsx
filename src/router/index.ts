import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './route'

const base = import.meta.env.BASE_URL

const router = createRouter({
  history: createWebHistory(base),
  // history: createWebHashHistory(base),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

export default router
