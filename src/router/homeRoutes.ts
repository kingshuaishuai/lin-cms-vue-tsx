import homeRoutersInfo from '@/config/stage'
import { RouterRecordDesc } from '@/utils/types'
import { RouteRecordRaw } from 'vue-router'

export function deepTravel(
  source: RouterRecordDesc | RouterRecordDesc[],
  handler: (routerDesc: RouterRecordDesc) => void,
) {
  if (Array.isArray(source)) {
    source.forEach((r) => deepTravel(r, handler))
    return
  }
  handler(source)
  if (source.children?.length) {
    deepTravel(source.children, handler)
  }
}

const homeRoutes: RouteRecordRaw[] = []

deepTravel(homeRoutersInfo, (routerDesc) => {
  if (!routerDesc.component) return
  const viewRouter: RouteRecordRaw = {
    path: routerDesc.route,
    name: routerDesc.name,
    component: routerDesc.component,
    meta: {
      title: routerDesc.title,
      icon: routerDesc.icon,
      permission: routerDesc.permission,
      type: routerDesc.type,
    },
  }
  homeRoutes.push(viewRouter)
})

export default homeRoutes
