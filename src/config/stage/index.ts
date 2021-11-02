import { RouterRecordDesc, ROUTER_TYPE } from '@/utils/types'
import { deepReduceName } from '@/utils/utils'
import { adminRouter } from './admin'

const stageConfig: RouterRecordDesc[] = [
  {
    title: '林间有风',
    type: ROUTER_TYPE.VIEW,
    name: 'about',
    route: '/about',
    component: () => import('@/view/About'),
    inNav: true,
    icon: 'iconset0103',
    order: 1,
  },
  {
    title: '日志管理',
    type: ROUTER_TYPE.VIEW,
    name: 'log',
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
    name: 'center',
    route: '/center',
    component: () => import('@/view/Center'),
    inNav: false,
    icon: 'rizhiguanli',
  },
  {
    title: '404',
    type: ROUTER_TYPE.VIEW,
    name: '404',
    route: '/404',
    component: () => import('@/view/ErrorPage/404'),
    inNav: false,
    icon: 'rizhiguanli',
  },
  adminRouter,
]

deepReduceName(stageConfig)

export default stageConfig
