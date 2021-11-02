import Icon from '@/components/base/Icon'
import { defineComponent } from 'vue'
import { useClearHistories } from '../ReuseTab/hooks'

export default defineComponent({
  name: 'ClearTab',
  setup() {
    const clearHistories = useClearHistories()
    return () => {
      return (
        <div title="清除历史记录" onClick={clearHistories}>
          <Icon class="navbar-icon" name="moshubang"></Icon>
        </div>
      )
    }
  },
})
