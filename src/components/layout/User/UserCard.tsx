import Avatar from 'ant-design-vue/lib/avatar/Avatar'
import { defineComponent } from 'vue'
import defaultAvatarUrl from '@/assets/image/user/user.png'
import corner from '@/assets/image/user/corner.png'
import './UserCard.less'
import Icon from '@/components/base/Icon'

export default defineComponent({
  name: 'UserCard',
  setup() {
    return () => {
      return (
        <div class="userCard">
          <div class="userInfo">
            <img src={corner} class="userCard__corner" />
            <div class="userInfo__avatar">
              <Avatar
                class="userInfo__avatar-img"
                src={defaultAvatarUrl}
                shape="circle"
              />
            </div>
            <div class="userInfo__detail">
              <div class="userInfo__detail-username">Root</div>
            </div>
          </div>
          <ul class="userCard__operate">
            <li class="userCard__operate-item userCard__operate-userCenter">
              <Icon name="weibaoxitongshangchuanlogo-" />
              <span>个人中心</span>
            </li>
            <li class="userCard__operate-item userCard__operate-logout">
              <Icon name="tuichu" />
              <span>退出账户</span>
            </li>
          </ul>
        </div>
      )
    }
  },
})
