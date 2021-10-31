import PropTypes from '@/utils/PropTypes'
import { BackTop } from 'ant-design-vue'
import { defineComponent } from 'vue'
import Icon from '@/components/base/Icon'
import './index.less'

const backTopProps = {
  right: PropTypes.number().def(50),
  bottom: PropTypes.number().def(50),
  fontSize: PropTypes.number().def(34),
  target: PropTypes.func<() => Window | HTMLElement | Document>(),
  visibilityHeight: PropTypes.number().def(100),
}

export type BackTopProps = typeof backTopProps

export default defineComponent({
  name: 'BackTop',
  props: backTopProps,
  setup(props) {
    return () => {
      const { right, bottom, fontSize, ...others } = props
      return (
        <BackTop
          class="lin-back-top"
          style={{
            right: right + 'px',
            bottom: bottom + 'px',
          }}
          {...others}
        >
          <Icon
            class="lin-back-top-icon"
            style={{
              fontSize: fontSize + 'px',
            }}
            name="xsaaa"
          />
        </BackTop>
      )
    }
  },
})
