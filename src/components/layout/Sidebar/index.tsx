import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { Menu } from 'ant-design-vue'
import Logo, { logoProps } from './logo'
import MenuTree from './MenuTree'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { MenuItem } from './types'
import './index.less'
import MenuSearch from './MenuSearch'
import useWindowSize, { WINDOW_SIZE } from '@/hooks/useWindowSize'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'

const sidebarProps = {
  ...logoProps,
}

export default defineComponent({
  name: 'Sidebar',
  props: sidebarProps,
  emits: ['switchPage'],
  setup(props, { emit }) {
    const openKeys = useOpenKeys()
    const { sidebarList, selectedKeys } = useSidebarListAndSelectedKeys()
    const { windowSize } = useWindowSize()
    const onSwitchPage = () => {
      emit('switchPage')
    }

    return () => {
      const { isCollapsed } = props
      return (
        <div class="app-sidebar">
          <div class="logo-wrapper">
            <Logo isCollapsed={isCollapsed}></Logo>
          </div>
          <div class="app-sidebar__main">
            <MenuSearch
              v-show={!isCollapsed && windowSize.value !== WINDOW_SIZE.SMALL}
            />
            <Menu
              class="app-sidebar__main__menu"
              mode="inline"
              v-models={[
                [openKeys.value, 'openKeys'],
                [selectedKeys.value, 'selectedKeys'],
              ]}
            >
              {sidebarList.value.map((menuItem) => (
                <MenuTree
                  onSwitchPage={onSwitchPage}
                  key={menuItem.name}
                  menuItem={menuItem}
                />
              ))}
            </Menu>
          </div>
        </div>
      )
    }
  },
})

function useOpenKeys() {
  const openKeys = ref<string[]>(getOpenKeysCache())
  onBeforeMount(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('openKeys', JSON.stringify(openKeys.value))
    })
  })
  return openKeys
}

/**
 * ?????????????????????????????????????????????????????????????????????
 * @param list
 * @param path
 * @returns
 */
function findMenuItemByPath(
  list: MenuItem[],
  path: string,
): MenuItem | undefined {
  let result: MenuItem | undefined
  result = list.find((item) => item.path.includes(path))
  if (result) {
    return result
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].children) {
      result = findMenuItemByPath(list[i].children!, path)
    }
    if (result) {
      return result
    }
  }
  return result
}

/**
 * ?????????????????????????????????
 * @returns
 */
function getOpenKeysCache(): string[] {
  const localOpenKeysString = localStorage.getItem('openKeys')
  let openKeys: string[] = []
  if (localOpenKeysString) {
    try {
      openKeys = JSON.parse(localOpenKeysString)
    } catch (err) {}
  }
  return openKeys
}

function useSidebarListAndSelectedKeys() {
  const userStore = useUserStore()
  const { sidebarList } = storeToRefs(useUserStore())

  const selectedKeys = ref<string[]>([])

  const setSelectedKeysByPath = (route: RouteLocationNormalizedLoaded) => {
    const matchedPath = route.matched[route.matched.length - 1].path
    const matchedMenu = findMenuItemByPath(sidebarList.value, matchedPath)
    if (matchedMenu) {
      selectedKeys.value = [matchedMenu.title]
    } else {
      selectedKeys.value = []
    }
  }

  const route = useRoute()

  watch(
    route,
    (to) => {
      setSelectedKeysByPath(to)
    },
    {
      immediate: true,
    },
  )
  return {
    sidebarList,
    selectedKeys,
  }
}
