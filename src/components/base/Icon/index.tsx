import PropTypes from '@/utils/PropTypes'
import { defineComponent } from 'vue'
import { IconName } from './type'
import './index.less'

const linIconProps = {
  name: PropTypes.strOption<IconName>().isRequired,
  onClick: PropTypes.func<(event: MouseEvent) => void>(),
}

export type LinIconProps = typeof linIconProps

export default defineComponent({
  name: 'LinIcon',
  props: linIconProps,
  setup(props) {
    return () => {
      const { name, ...others } = props
      return (
        <i class={['iconfont', `icon-${name}`, 'lin-icon']} {...others}></i>
      )
    }
  },
})
