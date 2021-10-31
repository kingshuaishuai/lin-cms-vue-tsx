import Icon from '@/components/base/Icon'
import { IconName } from '@/components/base/Icon/type'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { onBeforeRouteUpdate, RouterLink, useRouter } from 'vue-router'
import { CloseOutlined } from '@ant-design/icons-vue'
import './index.less'
import BScroll from '@/components/base/BScroll'
import { usePathToStageMap, useStageList } from '@/store/hooks'

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

const useRouteHistories = () => {
  const localCache = getCacheHistories()
  const histories = ref<
    Array<{
      stageId: string | symbol
      path: string
      routePath: string
    }>
  >(localCache)
  onBeforeRouteUpdate((to) => {
    const exist = histories.value.find((item) => item.path === to.path)
    if (exist) return
    histories.value.unshift({
      stageId: to.name as string | symbol,
      path: to.path,
      routePath: to.matched[to.matched.length - 1].path,
    })
  })

  onBeforeMount(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('history', JSON.stringify(histories.value))
    })
  })

  return histories
}

export default defineComponent({
  name: 'ReuseTab',
  setup() {
    const histories = useRouteHistories()
    const stageList = useStageList()
    const router = useRouter()
    return () => {
      return (
        <BScroll scrollX>
          <div class="reuseTab">
            {histories.value.map((item, index) => (
              <RouterLink
                exactActiveClass="reuseTab__item--active"
                class="reuseTab__item"
                to={item.path}
                key={item.stageId}
              >
                <Icon
                  class="reuseTab__item-icon"
                  name={stageList.value[item.stageId].icon as IconName}
                />
                <span class="reuseTab__item-title">
                  {stageList.value[item.stageId].title}
                </span>
                <CloseOutlined
                  class="reuseTab__item-close"
                  onClick={(event) => {
                    event.preventDefault()
                    let nextShowIndex: number

                    if (histories.value.length > 1) {
                      nextShowIndex = index === 0 ? index + 1 : index - 1
                      const nextStage = histories.value[nextShowIndex]
                      histories.value.splice(index, 1)
                      router.push(nextStage.path)
                    } else {
                      if (item.path !== '/about') {
                        histories.value.splice(index, 1)
                      }
                      router.push('/about')
                    }
                  }}
                />
              </RouterLink>
            ))}
          </div>
        </BScroll>
      )
    }
  },
})
