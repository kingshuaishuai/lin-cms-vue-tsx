import { Dropdown } from 'ant-design-vue'
import Avatar from 'ant-design-vue/lib/avatar/Avatar'
import { defineComponent } from 'vue'
import defaultAvatar from '@/assets/image/user/user.png'
import UserCard from './UserCard'
import './index.less'

export default defineComponent({
  name: 'User',
  setup() {
    return () => {
      return (
        <div class="user">
          <Dropdown overlay={() => <UserCard />} placement="bottomLeft">
            <div class="user__avatar">
              <Avatar
                size="large"
                shape="circle"
                style={{
                  cursor: 'pointer',
                }}
                src={
                  'http://face.api.talelin.com/assets/2021/10/29/a72e8d7305154c6581ae541046dccdab.jpg'
                }
              ></Avatar>
            </div>
          </Dropdown>
        </div>
      )
    }
  },
})
