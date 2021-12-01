import PageContainer from '@/components/layout/PageContainer'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Center',
  setup() {
    return () => {
      return <PageContainer title="个人中心"></PageContainer>
    }
  },
})
