import { nextTick, onBeforeMount, reactive, Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import './index.less'
import { useNameToStageMap, usePathToStageMap } from '@/hooks/stage'
import Config from '@/config'

const histories = ref<
  Array<{
    stageId: string | symbol
    path: string
    routePath: string
  }>
>([])

// 默认的路由地址
const DEFAULT_ROUTE = Config.defaultRoute || '/about'

interface ReuseTabItem {
  stageId: string | symbol
  path: string
  routePath: string
}

const getCacheHistories = (): ReuseTabItem[] => {
  const storiesString = localStorage.getItem('history')
  const pathToStageMap = usePathToStageMap()
  if (!storiesString) return []
  try {
    let localHistories = JSON.parse(storiesString)
    if (Array.isArray(localHistories)) {
      return localHistories.filter((item) => {
        const stage = pathToStageMap.value[item.routePath]
        if (stage) {
          item.stageId = stage.name
          return true
        }
        return false
      })
    }
  } catch (err) {}
  return []
}

export const useRouteHistories = () => {
  const localCache = getCacheHistories()
  histories.value = localCache
  const route = useRoute()
  const nameToStageMap = useNameToStageMap()
  const pathToStageMap = usePathToStageMap()
  watch(
    route,
    (to) => {
      const exist = histories.value.find((item) => item.path === to.path)
      if (exist) return
      if (!to.name) return
      const findResult =
        nameToStageMap.value[to.name] || pathToStageMap.value[to.path]
      if (!findResult) return

      histories.value = [
        {
          stageId: to.name as string | symbol,
          path: to.path,
          routePath: to.matched[to.matched.length - 1].path,
        },
        ...histories.value,
      ]
    },
    {
      immediate: true,
    },
  )

  onBeforeMount(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('history', JSON.stringify(histories.value))
    })
  })

  const router = useRouter()

  const handleCloseHistoryTab = (
    event: MouseEvent,
    item: ReuseTabItem,
    index: number,
  ) => {
    event.preventDefault()
    let nextShowIndex: number

    if (histories.value.length > 1) {
      nextShowIndex = index === 0 ? index + 1 : index - 1
      const nextStage = histories.value[nextShowIndex]
      histories.value.splice(index, 1)
      router.push(nextStage.path)
    } else {
      if (item.path !== DEFAULT_ROUTE) {
        histories.value.splice(index, 1)
      }
      router.push('/')
    }
  }

  return { histories, handleCloseHistoryTab }
}

export const useMenuContext = (histories: Ref<ReuseTabItem[]>) => {
  const router = useRouter()
  const container = ref<HTMLElement>()
  const menuInfo = reactive({
    left: 0,
    top: 18,
    visible: false,
    hasLeft: true,
    hasRight: true,
    hasOthers: true,
    currentIndex: 0,
  })
  const hasLeft = (index: number) => index > 0
  const hasRight = (index: number) => index < histories.value.length - 1
  const hasOthers = () => histories.value.length !== 1

  const onContextmenuTag = (event: MouseEvent, index: number) => {
    event.preventDefault()
    event.stopPropagation()
    const menuWidth = 126
    const containerLeftDistance = container.value!.getBoundingClientRect().left
    const offsetWidth = container.value!.clientWidth
    const maxLeft = offsetWidth - menuWidth
    const positionLeft = event.clientX - containerLeftDistance + 15

    if (positionLeft > maxLeft) {
      menuInfo.left = maxLeft
    } else {
      menuInfo.left = positionLeft
    }

    if (!hasOthers() && histories.value[index].path === DEFAULT_ROUTE) {
      return
    }
    menuInfo.visible = true
    menuInfo.hasLeft = hasLeft(index)
    menuInfo.hasRight = hasRight(index)
    menuInfo.hasOthers = hasOthers()
    menuInfo.currentIndex = index
  }

  const route = useRoute()

  const closeLeft = () => {
    const currentTab = histories.value[menuInfo.currentIndex]
    const currentRouteIndex = histories.value.findIndex(
      (item) => item.path === route.path,
    )
    histories.value.splice(0, menuInfo.currentIndex)
    // 当前页面路由处于关闭的tab中，则将当前右键的tab设置为当前路由
    if (currentRouteIndex < menuInfo.currentIndex) {
      router.push(currentTab.path)
    }
  }
  const closeRight = () => {
    const currentTab = histories.value[menuInfo.currentIndex]
    const currentRouteIndex = histories.value.findIndex(
      (item) => item.path === route.path,
    )
    histories.value.splice(menuInfo.currentIndex + 1)
    // 当前页面路由处于关闭的tab中，则将当前右键的tab设置为当前路由
    if (currentRouteIndex > menuInfo.currentIndex) {
      router.push(currentTab.path)
    }
  }
  const closeAll = () => {
    const currentTab = histories.value[menuInfo.currentIndex]
    if (currentTab.path === DEFAULT_ROUTE) {
      histories.value = [currentTab]
    } else {
      histories.value = []
    }
    router.push('/')
  }
  const closeOthers = () => {
    const currentTab = histories.value[menuInfo.currentIndex]
    histories.value = [currentTab]
    router.push(currentTab.path)
  }

  const closeMenu = () => {
    menuInfo.visible = false
  }
  watch(
    () => menuInfo.visible,
    (visible) => {
      if (visible) {
        nextTick(() => {
          document.body.addEventListener('click', closeMenu)
        })
      } else {
        nextTick(() => {
          document.body.removeEventListener('click', closeMenu)
        })
      }
    },
  )

  return {
    container,
    menuInfo,
    onContextmenuTag,
    closeLeft,
    closeRight,
    closeOthers,
    closeAll,
  }
}

export const useClearHistories = () => {
  const route = useRoute()
  const router = useRouter()
  const clearHistories = () => {
    if (route.path === DEFAULT_ROUTE) {
      histories.value = [
        {
          stageId: route.name!,
          path: route.path,
          routePath: route.matched[route.matched.length - 1].path,
        },
      ]
    } else {
      histories.value = []
    }
    router.push('/')
  }
  return clearHistories
}
