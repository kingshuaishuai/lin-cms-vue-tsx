import { MenuItem } from '@/components/layout/Sidebar/types'
import { deepTravel } from '@/router/homeRoutes'
import { Permission, User } from '@/store/type'
import { RouterRecordDesc, ROUTER_TYPE } from '@/utils/types'
import { hasPermission } from '@/utils/utils'
import { Ref } from '@vue/reactivity'
import { cloneDeep } from 'lodash'
import { ref } from 'vue'

export interface StageCache {
  [key: string | symbol]: RouterRecordDesc
}

export interface PathToStageMap {
  [key: string]: RouterRecordDesc
}

export const nameToStageMap: Ref<StageCache> = ref({})
export const pathToStageMap: Ref<PathToStageMap> = ref({})

/**
 * 获取当前用户有权限访问的路由配置
 * @param stageConfig
 * @param permissions
 * @param user
 * @returns
 */
export function getPermissionStageConfig(
  stageConfig: RouterRecordDesc[],
  permissions: Permission[],
  user: User,
) {
  const tempStageConfig = cloneDeep(stageConfig)
  const shookConfig = permissionShaking(tempStageConfig, permissions, user)
  let nameToStage: StageCache = {}
  let pathToStage: PathToStageMap = {}
  deepTravel(shookConfig, (item) => {
    if (item.name) {
      nameToStage[item.name] = item
      pathToStage[item.route] = item
    }
  })
  nameToStageMap.value = nameToStage
  pathToStageMap.value = pathToStage
  return shookConfig
}

/**
 * Shaking 掉无权限路由
 * @param stageConfig 路由配置项数据
 * @param permissions 当前登录管理员所拥有的权限集合
 * @param currentUser 当前登录管理员
 * @returns
 */
function permissionShaking(
  stageConfig: RouterRecordDesc[],
  permissions: Permission[],
  currentUser: User,
) {
  const shookConfig = stageConfig.filter((route) => {
    if (hasPermission(permissions, route, currentUser)) {
      if (route.children && route.children.length) {
        route.children = permissionShaking(
          route.children,
          permissions,
          currentUser,
        )
      }
      return true
    }
    return false
  })
  return IterationDelateMenuChildren(shookConfig)
}

/**
 * 在侧边栏展示时，如果当前路由 children 属性为空，则删除该路由
 * @param {*} arr 路由配置项数据
 */
function IterationDelateMenuChildren(arr: RouterRecordDesc[]) {
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children && !arr[i].children?.length) {
        delete arr[i]
      } else if (arr[i].children) {
        IterationDelateMenuChildren(arr[i].children!)
      }
    }
  }
  return arr
}

/**
 * 从路由配置中获取展示的侧边栏数据
 * @param target 路由描述对象
 * @param level 获取几级的数据(默认3级)
 * @returns
 */
export function deepGetSidebar(
  target: RouterRecordDesc | RouterRecordDesc[],
  level = 3,
): MenuItem | MenuItem[] | null {
  if (Array.isArray(target)) {
    const acc = target.map(
      (item) => deepGetSidebar(item, level - 1) as MenuItem,
    )
    return acc.filter((item) => item !== null)
  }

  if (!target.inNav) {
    return null
  }

  let sideConfig: MenuItem

  switch (target.type) {
    case ROUTER_TYPE.FOLDER:
      if (level <= 0) return null
      sideConfig = {
        name: target.name,
        title: target.title,
        icon: target.icon,
        path: target.route,
      }
      target.children &&
        (sideConfig.children = deepGetSidebar(target.children) as MenuItem[])
      return sideConfig
    case ROUTER_TYPE.VIEW:
      sideConfig = {
        name: target.name,
        title: target.title,
        icon: target.icon,
        path: target.route,
      }
      return sideConfig
    case ROUTER_TYPE.TAB:
      sideConfig = {
        name: target.name,
        title: target.title,
        icon: target.icon,
        path: target.route,
      }
      if (!sideConfig.path) {
        if (
          target.children &&
          target.children.length > 0 &&
          target.children[0].route
        ) {
          sideConfig.path = target.children[0].route
        }
      }
      return sideConfig
    default:
      return null
  }
}
