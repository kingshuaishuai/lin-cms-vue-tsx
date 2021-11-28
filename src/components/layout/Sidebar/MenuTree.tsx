import Icon from '@/components/base/Icon'
import { IconName } from '@/components/base/Icon/type'
import PropTypes from '@/utils/PropTypes'
import { Menu } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { MenuItem } from './types'

const menuTreeProps = {
  menuItem: PropTypes.object<MenuItem>().isRequired,
}

const MenuTree = defineComponent({
  name: 'MenuTree',
  props: menuTreeProps,
  emits: ['switchPage'],
  setup(props, { emit }) {
    const router = useRouter()
    const navigateTo = (path: string) => {
      emit('switchPage')
      router.push({ path })
    }
    return () => {
      const { menuItem } = props
      return menuItem.children?.length ? (
        <Menu.SubMenu
          key={menuItem.title}
          icon={<Icon name={menuItem.icon as IconName} />}
          title={menuItem.title}
        >
          {menuItem.children.map((menu) => (
            <MenuTree key={menu.name} menuItem={menu} />
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={menuItem.title}
          icon={<Icon name={menuItem.icon as IconName} />}
          onClick={() => navigateTo(menuItem.path)}
        >
          <span class="title">{menuItem.title}</span>
        </Menu.Item>
      )
    }
  },
})

export default MenuTree
