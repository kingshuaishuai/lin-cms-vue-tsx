import { defineComponent } from 'vue'
import './index.less'

export default defineComponent({
  name: 'PageContainer',
  props: {
    title: [Function, String],
  },
  setup(props, { slots }) {
    return () => {
      return (
        <div class="page-container">
          <div class="page-container__title">
            {typeof props.title === 'function' ? props.title() : props.title}
          </div>
          {slots.default?.()}
        </div>
      )
    }
  },
})
