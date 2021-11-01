import { Layout } from 'ant-design-vue'
import {
  ComponentPublicInstance,
  computed,
  CSSProperties,
  defineComponent,
  onMounted,
  Ref,
  ref,
  watch,
} from 'vue'
import BackTop from '@/components/layout/BackTop'
import Sidebar from '@/components/layout/Sidebar'
import useWindowSize, { WINDOW_SIZE } from '@/hooks/useWindowSize'
import './index.less'
import Icon from '@/components/base/Icon'
import Navbar from '@/components/layout/Navbar'
import ReuseTab from '@/components/layout/ReuseTab'
import AppMain from '@/components/layout/AppMain'

export default defineComponent({
  name: 'Home',
  setup() {
    const { isCollapsed, toggleCollapse } = useToggleSideCollapsed()
    const { windowSize, windowHeight } = useWindowSize()
    useAutoToggleSideByWindowSize(windowSize, toggleCollapse)
    const showMask = computed(() => {
      return windowSize.value === WINDOW_SIZE.SMALL && !isCollapsed.value
    })
    const main = ref<ComponentPublicInstance>()
    const sidebarStyle = useSidebarStyle(windowSize, windowHeight, isCollapsed)
    return () => {
      return (
        <Layout>
          <Layout.Sider
            collapsed={isCollapsed.value}
            width={210}
            collapsedWidth={64}
            style={sidebarStyle.value}
          >
            <Sidebar isCollapsed={isCollapsed.value} />
          </Layout.Sider>
          <Layout>
            <Layout.Header class="app-header">
              <div class="app-header__operate">
                <Icon
                  onClick={() => toggleCollapse()}
                  class={[
                    'menu-switch-icon',
                    { 'menu-switch-icon--rotate': isCollapsed.value },
                  ]}
                  name="fold"
                />
                <Navbar />
              </div>
              <ReuseTab />
            </Layout.Header>
            <Layout.Content ref={main}>
              <AppMain />
            </Layout.Content>
            <BackTop target={() => main.value?.$el} visibilityHeight={100} />
          </Layout>
          <div
            class={['side-nav-mask', { 'side-nav-mask-show': showMask.value }]}
            onClick={() => toggleCollapse(true)}
          />
        </Layout>
      )
    }
  },
})

const useToggleSideCollapsed = () => {
  const isCollapsed = ref(false)
  const toggleCollapse = (isCollapse?: boolean) => {
    isCollapsed.value =
      typeof isCollapse === 'boolean' ? isCollapse : !isCollapsed.value
  }
  return {
    isCollapsed,
    toggleCollapse,
  }
}

const useSidebarStyle = (
  windowSize: Ref<WINDOW_SIZE>,
  windowHeight: Ref<number>,
  isCollapsed: Ref<boolean>,
) => {
  const sidebarStyle = computed<CSSProperties>(() => {
    return windowSize.value === WINDOW_SIZE.SMALL
      ? {
          position: 'absolute',
          height: windowHeight.value + 'px',
          zIndex: 12,
          transform: `translateX(${isCollapsed.value ? '-210px' : 0})`,
        }
      : {}
  })
  return sidebarStyle
}

const useAutoToggleSideByWindowSize = (
  windowSize: Ref<WINDOW_SIZE>,
  toggleCollapse: (isCollapse?: boolean | undefined) => void,
) => {
  const listener = () => {
    // 切换到小屏中屏，进行折叠,切换到大屏自动展开
    if (windowSize.value !== WINDOW_SIZE.LARGE) {
      toggleCollapse(true)
    } else {
      toggleCollapse(false)
    }
  }
  onMounted(listener)
  watch(windowSize, listener)
}
