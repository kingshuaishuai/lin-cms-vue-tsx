import { RouteRecordRaw } from 'vue-router'
import Home from '@/view/Home'
import homeRoutes from './homeRoutes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/about',
    children: [...homeRoutes],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/view/Login'),
  },
]

export default routes
