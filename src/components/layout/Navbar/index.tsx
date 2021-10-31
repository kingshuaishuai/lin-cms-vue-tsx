import { useStageInfo } from '@/store/hooks'
import { Breadcrumb } from 'ant-design-vue'
import { defineComponent } from 'vue'
import ScreenFull from '../ScreenFull'
import User from '../User'
import './index.less'

export default defineComponent({
  name: 'Navbar',
  setup() {
    const stageInfo = useStageInfo()
    return () => {
      return (
        <div class="app-navbar">
          <div class="app-navbar__title">
            <Breadcrumb>
              {stageInfo.value.map((stage) => (
                <Breadcrumb.Item>{stage.title}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <div class="app-navbar__operate">
            <ScreenFull class="app-navbar__operate-item" />
            <User class="app-navbar__operate-item" />
          </div>
        </div>
      )
    }
  },
})
