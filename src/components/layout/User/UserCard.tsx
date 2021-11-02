import Avatar from 'ant-design-vue/lib/avatar/Avatar'
import { defineComponent } from 'vue'
import defaultAvatar from '@/assets/image/user/user.png'
import corner from '@/assets/image/user/corner.png'
import './UserCard.less'
import Icon from '@/components/base/Icon'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ACTION_TYPES } from '@/store/actionTypes'

export default defineComponent({
  name: 'UserCard',
  setup() {
    const router = useRouter()
    const store = useStore()
    const user = store.state.user.user
    const logout = () => {
      store.dispatch(ACTION_TYPES.LOGOUT)
      window.location.reload()
      // router.push('/login')
    }

    return () => {
      return (
        <div class="userCard">
          <div class="userInfo">
            <img src={corner} class="userCard__corner" />
            <div class="userInfo__avatar">
              <Avatar
                class="userInfo__avatar-img"
                src={user?.avatar || defaultAvatar}
                shape="circle"
                alt={user?.nickname}
              />
            </div>
            <div class="userInfo__detail">
              <div class="userInfo__detail-username">
                {user?.nickname || '佚名'}
              </div>
            </div>
          </div>
          <ul class="userCard__operate">
            <li
              onClick={() => router.push('/center')}
              class="userCard__operate-item userCard__operate-userCenter"
            >
              <Icon name="weibaoxitongshangchuanlogo-" />
              <span>个人中心</span>
            </li>
            <li
              onClick={logout}
              class="userCard__operate-item userCard__operate-logout"
            >
              <Icon name="tuichu" />
              <span>退出账户</span>
            </li>
          </ul>
        </div>
      )
    }
  },
})
