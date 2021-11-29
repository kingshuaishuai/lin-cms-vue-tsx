import { RouterRecordDesc, ROUTER_TYPE } from '@/utils/types'
const adminRouter: RouterRecordDesc = {
  route: '',
  name: '',
  title: '权限管理',
  type: ROUTER_TYPE.FOLDER,
  icon: 'huiyuanguanli',
  inNav: true,
  permission: ['超级管理员独有权限'],
  children: [
    {
      route: '/admin/user',
      name: '',
      title: '用户管理',
      type: ROUTER_TYPE.FOLDER, // 取 route 为默认加载页
      icon: 'huiyuanguanli',
      inNav: true,
      children: [
        {
          title: '用户列表',
          type: ROUTER_TYPE.VIEW,
          name: 'userList',
          route: '/admin/user/list',
          component: () => import('@/view/Admin/User/UserList'),
          inNav: true,
          icon: 'huiyuanguanli',
          permission: ['超级管理员独有权限'],
        },
        {
          title: '添加用户',
          type: ROUTER_TYPE.VIEW,
          inNav: true,
          route: '/admin/user/add',
          icon: 'add',
          name: 'UserCreate',
          component: () => import('@/view/Admin/User/UserCreate'),
          permission: ['超级管理员独有权限'],
        },
      ],
    },
    {
      route: '/admin/group/list',
      name: '',
      title: '分组管理',
      type: ROUTER_TYPE.TAB, // 取 route 为默认加载页
      icon: 'yunyingguanli_fuwufenzuguanli',
      inNav: true,
      children: [
        {
          route: '/admin/group/list',
          type: ROUTER_TYPE.VIEW,
          name: 'groupList',
          inNav: true,
          component: () => import('@/view/Admin/Group/GroupList'),
          title: '分组列表',
          icon: 'huiyuanguanli',
          permission: ['超级管理员独有权限'],
        },
        {
          route: '/admin/group/add',
          type: ROUTER_TYPE.VIEW,
          name: 'GroupCreate',
          component: () => import('@/view/Admin/Group/GroupCreate'),
          inNav: true,
          title: '添加分组',
          icon: 'add',
          permission: ['超级管理员独有权限'],
        },
        {
          route: '/admin/group/edit',
          type: ROUTER_TYPE.HIDE,
          name: 'GroupEdit',
          component: () => import('@/view/Admin/Group/GroupEdit'),
          inNav: false,
          title: '修改分组',
          icon: 'add',
          permission: ['超级管理员独有权限'],
        },
      ],
    },
  ],
}

export { adminRouter }
