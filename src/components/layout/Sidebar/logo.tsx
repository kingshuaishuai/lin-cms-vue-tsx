import { computed, defineComponent } from 'vue'
import logo from '@/assets/image/logo.png'
import mobileLogo from '@/assets/image/mobile-logo.png'
import PropTypes from '@/utils/PropTypes'

export const logoProps = {
  isCollapsed: PropTypes.bool().isRequired
}

export default defineComponent({
  name: 'Logo',
  props: logoProps,
  setup(props) {
    const showLogo = computed(() => props.isCollapsed ? mobileLogo : logo)
    return () => {
      return (
        <div class={[
          props.isCollapsed ? 'mobile-logo' : 'logo'
        ]}>
          <img src={showLogo.value} alt="logo" />
        </div>
      )
    }
  }
})
