import { defineComponent } from 'vue'

export default defineComponent({
  name: '404',
  setup() {
    return () => {
      return <div>404 Not Found</div>
    }
  },
})
