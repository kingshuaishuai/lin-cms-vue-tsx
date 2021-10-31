import Icon from '@/components/base/Icon'
import { useScreenFull } from '@/hooks/useFullscreen'
import { message } from 'ant-design-vue'
import { defineComponent } from 'vue'
import './index.less'

export default defineComponent({
  name: 'ScreenFull',
  setup() {
    const { isFullscreen, toggleFullScreen, fullscreenEnabled } =
      useScreenFull()

    const handleFullScreen = () => {
      if (!fullscreenEnabled.value) {
        message.warn({
          content: 'you browser can not work',
        })
        return
      }
      toggleFullScreen()
    }
    return () => {
      return (
        <div
          title="全屏/正常"
          class="fullscreen"
          style={{
            cursor: 'pointer',
          }}
          onClick={handleFullScreen}
        >
          <Icon
            class="fullscreen-icon"
            name={isFullscreen.value ? 'quxiaoquanping' : 'quanping'}
          />
        </div>
      )
    }
  },
})
