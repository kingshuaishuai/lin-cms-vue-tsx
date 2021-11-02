import { Dropdown } from 'ant-design-vue'
import Avatar from 'ant-design-vue/lib/avatar/Avatar'
import { defineComponent, ref } from 'vue'
import defaultAvatar from '@/assets/image/user/user.png'
import UserCard from './UserCard'
import './index.less'
import { useStore } from '@/store'

export default defineComponent({
  name: 'User',
  setup() {
    const visible = ref(false)
    const store = useStore()
    return () => {
      return (
        <div class="user">
          <Dropdown
            v-model={[visible.value, 'visible']}
            overlay={() => <UserCard />}
            placement="bottomLeft"
          >
            <div class="user__avatar">
              <Avatar
                size="large"
                shape="circle"
                style={{
                  cursor: 'pointer',
                }}
                src={store.state.user.user?.avatar || defaultAvatar}
              ></Avatar>
            </div>
          </Dropdown>
        </div>
      )
    }
  },
})
