import { message } from 'ant-design-vue'
import Config from '@/config'
import { hasPermission } from '@/utils/utils'
import {
  createRouter,
  // createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './route'
import { useUserStore } from '@/store/user'

const base = import.meta.env.BASE_URL

const router = createRouter({
  // history: createWebHistory(base),
  history: createWebHashHistory(base),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

let isLoginRequired = (routerName?: string | symbol | null): boolean => {
  let { notLoginRoute = [] } = Config
  const notLoginMark: { [key: string]: boolean } = {}

  if (Array.isArray(notLoginRoute)) {
    for (let i = 0; i < notLoginRoute.length; i++) {
      notLoginMark[notLoginRoute[i].toString().toLowerCase()] = true
    }
  }

  // 构建闭包
  isLoginRequired = (name?: string | Symbol | null) => {
    if (!name) return true

    let targetName = typeof name === 'symbol' ? name.description : name
    targetName = (targetName as string).toLowerCase()

    return !notLoginMark[targetName]
  }

  return isLoginRequired(routerName)
}

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (isLoginRequired(to.name) && !userStore.loggedIn) {
    next({ path: '/login' })
    return
  }
  if (to.path === '/login' && userStore.loggedIn) {
    next({ path: '/' })
    return
  }

  const permissions = userStore.permissions
  if (
    userStore.user &&
    to.path !== '/about' &&
    !hasPermission(permissions, to.meta, userStore.user)
  ) {
    message.error('您无此页面的权限哟~')
    next({ path: '/about' })
    return
  }

  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // if (to.path === '/login') {
  //   localStorage.clear()
  // }
  next()
})

export default router
