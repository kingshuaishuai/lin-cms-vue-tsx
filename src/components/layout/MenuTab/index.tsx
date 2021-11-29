import Icon from '@/components/base/Icon'
import { useStageInfo } from '@/hooks/stage'
import { ROUTER_TYPE } from '@/utils/types'
import { computed, defineComponent, watch } from 'vue'
import { RouterLink } from 'vue-router'
import './index.less'

function useMenuTabs() {
  const stageInfo = useStageInfo()
  const menuTabs = computed(() => {
    const len = stageInfo.value.length
    if (len < 2) return []
    const father = stageInfo.value[len - 2]
    if (father.type === ROUTER_TYPE.TAB) {
      const menus =
        father.children
          ?.filter((item) => item.inNav)
          .map((item) => ({
            icon: item.icon || '',
            title: item.title,
            path: item.route,
          })) || []
      return menus
    }
    return []
  })
  return {
    menuTabs,
  }
}

export default defineComponent({
  name: 'MenuTab',
  setup() {
    const { menuTabs } = useMenuTabs()
    return () => {
      return (
        menuTabs.value.length !== 0 && (
          <ul class="menu-tab">
            {menuTabs.value.map((item) => (
              <RouterLink
                class="menu-tab__link"
                to={item.path}
                key={item.title}
              >
                <li class="menu-tab__item">
                  <Icon class="menu-tab__item-icon" name={item.icon} />
                  <span class="menu-tab__item-title">{item.title}</span>
                </li>
              </RouterLink>
            ))}
          </ul>
        )
      )
    }
  },
})
