import { useStore } from '@/store'
import { Layout } from 'ant-design-vue'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'About',
  setup() {
    const store = useStore()
    return () => {
      return <div>about page</div>
    }
  },
})
