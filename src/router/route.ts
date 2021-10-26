import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: import('../view/Home')
  },
  {
    path: '/about',
    name: 'About',
    component: import('../view/About')
  }
]

export default routes