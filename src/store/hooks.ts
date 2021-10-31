import { MenuItem } from '@/components/layout/Sidebar/types'
import { RouterRecordDesc } from '@/utils/types'
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useStore } from '.'
import {
  deepGetSidebar,
  getPermissionStageConfig,
  pathToStageMap,
  nameToStageMap,
} from './modules/router/utils'
import { User } from './type'

export const useSidebarList = () => {
  const store = useStore()
  const sidebarList = computed(() => {
    const { stageConfig } = store.state.router
    const { permissions, user } = store.state.user
    const permissionState = getPermissionStageConfig(
      stageConfig,
      permissions,
      user as User,
    )
    return deepGetSidebar(permissionState) as MenuItem[]
  })
  return sidebarList
}

export const useStageList = () => {
  return nameToStageMap
}

export const usePathToStageMap = () => {
  return pathToStageMap
}

const stageInfoCache: {
  [key: string | symbol]: RouterRecordDesc[]
} = {}

export const useStageInfo = () => {
  const route = useRoute()
  const store = useStore()
  const stageInfo = computed(() => {
    const name = route.name!
    if (stageInfoCache[name]) {
      return stageInfoCache[name]
    }
    const result = getStagePathByName(store.state.router.stageConfig, name)
    stageInfoCache[name] = result
    return result
  })
  return stageInfo
}

function getStagePathByName(
  stages: RouterRecordDesc[],
  name: string | symbol,
): RouterRecordDesc[] {
  const findStage = stages.find((s) => s.name === name)
  if (findStage) {
    return [findStage]
  }
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i]
    if (stage.children && stage.children.length > 1) {
      const result = getStagePathByName(stage.children, name)
      if (result.length) {
        return [stage, ...result]
      }
    }
  }
  return []
}

// []