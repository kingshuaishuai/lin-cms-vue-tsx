import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import BScroll from '@better-scroll/core'
import PropTypes from '@/utils/PropTypes'
import MouseWheel from '@better-scroll/mouse-wheel'
import './index.less'

BScroll.use(MouseWheel)

const scrollProps = {
  startX: PropTypes.number().def(0),
  startY: PropTypes.number().def(0),
  scrollX: PropTypes.bool(),
  scrollY: PropTypes.bool(),
  freeScroll: PropTypes.bool(),
  probeType: PropTypes.number().def(3),
  bounce: PropTypes.bool(),
  bounceTime: PropTypes.number().def(800),
  click: PropTypes.bool().def(true),
  mouseWheel: PropTypes.any().def({
    speed: 1,
    invert: false,
    easeTime: 300,
    dampingFactor: 0.1,
  }),
}

export default defineComponent({
  name: 'BScroll',
  props: scrollProps,
  setup(props, { slots }) {
    const observer = new MutationObserver(() => {
      bs?.refresh()
    })
    const scroll = ref<HTMLElement>()
    const content = ref<HTMLElement>()
    let bs: BScroll | undefined
    const init = () => {
      if (!scroll.value) {
        console.error('滚动元素不存在')
        return
      }
      bs = new BScroll(scroll.value, props)
    }
    const refresh = () => {
      bs?.refresh()
    }
    onMounted(() => {
      observer.observe(content.value!, {
        childList: true,
        subtree: true,
      })
      init()
      window.addEventListener('resize', refresh)
    })
    onBeforeUnmount(() => {
      bs?.destroy()
      observer.disconnect()
      window.removeEventListener('resize', refresh)
    })
    return () => {
      return (
        <div class="scroll-wrapper" ref={scroll}>
          <div
            ref={content}
            class={[
              'scroll-content',
              {
                'scroll-x': props.scrollX,
              },
            ]}
          >
            {slots.default?.()}
          </div>
        </div>
      )
    }
  },
})
