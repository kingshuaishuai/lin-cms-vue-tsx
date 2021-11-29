import { RouterRecordDesc } from '@/utils/types'
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { pathToStageMap, nameToStageMap } from '@/utils/stage'
import stageConfig from '@/config/stage'
import { ref, watch } from 'vue'

export const useNameToStageMap = () => {
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
  const stageInfo = ref<RouterRecordDesc[]>([])
  watch(
    route,
    () => {
      let result: RouterRecordDesc[] = []
      if (stageInfoCache[route.name!]) {
        result = stageInfoCache[route.name!]
      } else {
        result = getStagePathByName(stageConfig, route.name!)
        stageInfoCache[route.name!] = result
      }
      stageInfo.value = result
    },
    {
      immediate: true,
    },
  )
  return stageInfo
}

/**
 * 递归获取到当前stage链
 * @param stages
 * @param name
 * @returns
 */
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
