import { RouterRecordDesc, ROUTER_TYPE } from '@/utils/types'
import { deepReduceName } from '@/utils/utils'
import { adminRouter } from './admin'

const homeRoutersInfo: RouterRecordDesc[] = [
  {
    title: '林间有风',
    type: ROUTER_TYPE.VIEW,
    name: Symbol('about'),
    route: '/about',
    component: () => import('@/view/About'),
    inNav: true,
    icon: 'iconset0103',
    order: 1,
  },
  {
    title: '日志管理',
    type: ROUTER_TYPE.VIEW,
    name: Symbol('log'),
    route: '/log',
    component: () => import('@/view/Log'),
    inNav: true,
    icon: 'rizhiguanli',
    order: 2,
    permission: ['查询所有日志'],
  },
  {
    title: '个人中心',
    type: ROUTER_TYPE.VIEW,
    name: Symbol('center'),
    route: '/center',
    component: () => import('@/view/Center'),
    inNav: false,
    icon: 'rizhiguanli',
  },
  {
    title: '404',
    type: ROUTER_TYPE.VIEW,
    name: Symbol('404'),
    route: '/404',
    component: () => import('@/view/ErrorPage/404'),
    inNav: false,
    icon: 'rizhiguanli',
  },
  adminRouter,
]

deepReduceName(homeRoutersInfo)

export default homeRoutersInfo
