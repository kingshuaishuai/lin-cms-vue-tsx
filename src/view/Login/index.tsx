import { defineComponent, reactive, ref } from 'vue'
import teamName from '@/assets/image/login/team-name.png'
import './index.less'
import { Spin } from 'ant-design-vue'
import UserModel from '@/model/User'
import { throttle } from 'lodash'
import { Loading3QuartersOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useRouterStore } from '@/store/router'
import { useUserStore } from '@/store/user'

export default defineComponent({
  name: 'Login',
  setup() {
    const loading = ref(false)
    const account = reactive({
      username: '',
      password: '',
    })

    const router = useRouter()

    const routerStore = useRouterStore()
    const userStore = useUserStore()
    const login = async (event: Event) => {
      event.preventDefault()
      loading.value = true
      try {
        await UserModel.getToken(account)
        await getUserInfo()
        router.push(routerStore.defaultRoute)
      } catch (err) {
      } finally {
        loading.value = false
      }
    }

    const getUserInfo = async () => {
      const user = await UserModel.getPermissions()
      userStore.setUser(user)
      userStore.setLoggedIn()
    }

    const throttleLogin = throttle(login, 1000)
    return () => {
      return (
        <div class="login">
          <div class="team-name">
            <img class="team-name-img" src={teamName} alt="logo" />
          </div>
          <div class="login__form-box">
            <Spin
              spinning={loading.value}
              indicator={() => (
                <Loading3QuartersOutlined style={{ fontSize: '24px' }} spin />
              )}
            >
              <div class="login-title">
                <h1 class="login-title-content" title="Lin">
                  Lin CMS
                </h1>
              </div>
              <form
                class="login-form"
                autocomplete="off"
                onSubmit={throttleLogin}
              >
                <div class="form-item nickname">
                  <input
                    type="text"
                    v-model={account.username}
                    autocomplete="off"
                    placeholder="请填写用户名"
                  />
                </div>
                <div class="form-item password">
                  <input
                    type="password"
                    v-model={account.password}
                    autocomplete="off"
                    placeholder="请填写用户登录密码"
                  />
                </div>
                <button class="submit-btn" type="submit">
                  登录
                </button>
              </form>
            </Spin>
          </div>
        </div>
      )
    }
  },
})
