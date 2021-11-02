import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { Menu } from 'ant-design-vue'
import Logo, { logoProps } from './logo'
import MenuTree from './MenuTree'
import { useSidebarList } from '@/store/hooks'
import {
  onBeforeRouteUpdate,
  RouteLocationNormalizedLoaded,
  useRoute,
} from 'vue-router'
import { MenuItem } from './types'
import './index.less'

const sidebarProps = {
  ...logoProps,
}

export default defineComponent({
  name: 'Sidebar',
  props: sidebarProps,
  setup(props) {
    const openKeys = useOpenKeys()
    const { sidebarList, selectedKeys } = useSidebarListAndSelectedKeys()

    return () => {
      const { isCollapsed } = props
      return (
        <div class="app-sidebar">
          <div class="logo-wrapper">
            <Logo isCollapsed={isCollapsed}></Logo>
          </div>
          <div class="app-sidebar__main">
            <Menu
              class="app-sidebar__main__menu"
              mode="inline"
              v-models={[
                [openKeys.value, 'openKeys'],
                [selectedKeys.value, 'selectedKeys'],
              ]}
            >
              {sidebarList.value.map((menuItem) => (
                <MenuTree key={menuItem.name} menuItem={menuItem} />
              ))}
            </Menu>
          </div>
        </div>
      )
    }
  },
})

function useOpenKeys() {
  const openKeys = ref(getOpenKeysCache())
  onBeforeMount(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('openKeys', JSON.stringify(openKeys.value))
    })
  })
  return openKeys
}

/**
 * 根据侧边栏数据与路由地址寻找对应高亮的菜单按钮
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
 * 获取缓存的菜单展开数据
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
  const sidebarList = useSidebarList()
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
      if (to.path === '/login') {
        selectedKeys.value = []
      } else {
        setSelectedKeysByPath(to)
      }
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
