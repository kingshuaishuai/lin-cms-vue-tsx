import { computed, defineComponent, nextTick, ref } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { Select } from 'ant-design-vue'
import { OptionProps, SelectProps } from 'ant-design-vue/lib/select'
import { MenuItem } from './types'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const getLeafNodesFromSidebarList = (list: MenuItem[]): MenuItem[] => {
  const hasChildrenItems = list.filter((item) => !!item.children)
  const leafNodes = list.filter((item) => !item.children)

  const childLeafNodes = hasChildrenItems
    .map((item) => getLeafNodesFromSidebarList(item.children!))
    .flat()

  return [...leafNodes, ...childLeafNodes]
}

export default defineComponent({
  name: 'MenuSearch',
  setup() {
    const showPlaceholder = ref(true)
    const userStore = useUserStore()
    const options = computed<OptionProps[]>(() =>
      getLeafNodesFromSidebarList(userStore.sidebarList).map((item) => ({
        key: item.path,
        value: item.title,
      })),
    )
    const router = useRouter()
    const handleSelect: SelectProps['onSelect'] = (value, item) => {
      router.push({
        path: item.key as string,
      })
      hideSelect()
    }
    const selectRef = ref()
    const showSelect = () => {
      showPlaceholder.value = false
      nextTick(() => {
        selectRef.value?.focus()
      })
    }
    const hideSelect = () => {
      nextTick(() => {
        showPlaceholder.value = true
      })
    }

    return () => {
      return (
        <div class="menu-search">
          {showPlaceholder.value && (
            <div class="menu-search__placeholder" onClick={showSelect}>
              <SearchOutlined class="search-icon" />
            </div>
          )}
          {!showPlaceholder.value && (
            <Select
              ref={selectRef}
              class="menu-search__select"
              placeholder="请输入关键字"
              showSearch
              onSelect={handleSelect}
              options={options.value}
              onBlur={hideSelect}
            ></Select>
          )}
        </div>
      )
    }
  },
})
